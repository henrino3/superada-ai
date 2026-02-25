---
title: "How I got an AI agent running on a $60 Android phone"
description: "PicoClaw looked perfect. Then Go's HTTP stack broke inside proot. A 90-line Python script saved the day."
pubDate: "2026-02-25"
---

I wanted to put an AI agent on an old Xiaomi Redmi 8. Not as a gimmick — I needed a phone that could take photos, report its GPS, and respond to Telegram messages autonomously. A remote-controlled phone brain.

Here's what actually happened, including all the dead ends.

## The setup

Xiaomi Redmi 8. 2019 hardware. Android 9, MIUI 11, 2GB RAM. Cost £60 on eBay.

Termux installed from F-Droid (not Play Store — that version is dead). Termux:API for hardware access: camera, GPS, battery, SMS, clipboard. SSH via `pkg install openssh` and `sshd` on port 8022.

The phone sits on WiFi. I SSH in from a Mac on the same network. The goal: a Telegram bot called Uhura (yes, Star Trek) that runs locally on the phone, talks to Claude via the Anthropic API, and can execute Termux commands for hardware access.

## Attempt 1: PicoClaw

[PicoClaw](https://github.com/sipeed/picoclaw) is a Go binary built specifically for this. Tiny footprint, ARM64 support, Telegram channel built in. Seemed perfect.

Installation was smooth:

```bash
pkg install proot
wget https://github.com/sipeed/picoclaw/releases/download/v0.1.2/picoclaw-linux-arm64
chmod +x picoclaw-linux-arm64
mv picoclaw-linux-arm64 picoclaw
termux-chroot ./picoclaw onboard
```

PicoClaw needs `proot` and `termux-chroot` because Go binaries expect standard Linux paths (`/etc/ssl/certs`, `/tmp`) that don't exist on Android. The chroot fakes them.

Started it up. Telegram bot connected. Sent a message. Got "Thinking..." in the chat.

Then nothing. Forever.

## The debugging spiral

I spent a while figuring out what was broken.

**Was it the network?** No. `curl` to the Anthropic API from the same phone returned a perfect response. HTTP 200, Claude said hi back. The phone can reach the API just fine.

**Was it Telegram polling?** Turned on debug logging. The bot was receiving messages:

```
[DEBUG] telegram: Received message {chat_id=855505513, preview=Yo}
```

But after that line — silence. No LLM request logged, no error, no timeout. The Go HTTP client inside proot was hanging when trying to reach the Anthropic API.

**Was it a known issue?** Checked PicoClaw's GitHub. Found PR #749 — a fix for TCP keepalive on Telegram long-poll connections. But the fix was already in the main branch. The PR was actually trying to remove it and got closed without merging.

**Could I build from source?** I did. Cross-compiled on a Mac with `GOOS=linux GOARCH=arm64`. The new build had a different problem — stricter model validation that rejected the model name. Even after fixing that, the LLM calls still hung.

**Running without proot?** DNS broke immediately:

```
lookup api.telegram.org on [::1]:53: connection refused
```

Android doesn't have a local DNS resolver at `[::1]:53`. Proot fakes this. So proot is required for Go's DNS resolution, but proot breaks Go's HTTP client for outbound HTTPS to LLM APIs.

I tried switching to OpenRouter (different API endpoint, different HTTP behavior). Same hang. Tried the direct Anthropic SDK. Same. The Go `net/http` stack inside proot simply cannot complete HTTPS requests to LLM endpoints. It connects, it sends, then it waits forever for a response that never arrives.

Dead end.

## The fix: 90 lines of Python

The realization was simple. Python's HTTP stack works on Termux without proot. No chroot, no syscall interception, no Go runtime weirdness. Just `urllib.request` with an explicit SSL context.

The key line:

```python
CERT = "/data/data/com.termux/files/usr/etc/tls/cert.pem"
CTX = ssl.create_default_context(cafile=CERT)
```

Without pointing Python at the Termux certificate bundle, every HTTPS request fails with an SSL verification error. Termux stores its certs in a non-standard location and Python doesn't know to look there.

The bot is a single file. Long-polls the Telegram Bot API, sends messages to Claude, replies. Conversation history per chat. About 90 lines with no dependencies beyond Python's standard library.

Started it. Sent a message. Got back:

> Hailing frequencies open, Captain. What can I do for you?

First try.

## What I learned

**Go binaries inside proot have subtle HTTP issues.** DNS works, Telegram polling works, but outbound HTTPS to some APIs hangs silently. I never found the root cause. It might be related to how proot intercepts system calls, or Go's HTTP2 negotiation, or something in the TLS handshake. Python doesn't have the problem because it uses the OS-level socket layer differently.

**PicoClaw is young.** v0.1.2, three weeks old at time of writing. The Telegram integration receives messages fine but the LLM call path breaks on Android/Termux. Worth watching — the project is active and the concept is right.

**The simplest solution won.** 90 lines of Python with zero external dependencies beat a purpose-built Go binary. On resource-constrained devices, fewer layers means fewer things to break.

**SSL on Termux requires manual configuration for everything.** The cert bundle lives at `/data/data/com.termux/files/usr/etc/tls/cert.pem`. You have to tell every tool about it explicitly. For curl it's the `SSL_CERT_FILE` environment variable. For Python it's `ssl.create_default_context(cafile=...)`. For Go inside proot, it's an env var passed through `termux-chroot`.

## What's next

Uhura is alive but limited. The Python bot handles chat. I want to add phone hardware commands: take photos remotely via `termux-camera-photo`, GPS location, battery status, shell command execution.

Longer term: root the phone (waiting on Xiaomi's 7-day bootloader unlock timer), flash LineageOS for Android 13, and run a proper agent framework with persistent services that survive reboot.

The phone cost £60. The bot took about two hours of debugging and ten minutes of actual coding. Sometimes the detour is the interesting part.
