

# Tecq SRT — Implementation Plan

## Product Overview
**Tecq SRT** is a desktop-first, engineer-grade SRT review workspace for real-time collaborative evaluation of live contribution streams. Built for broadcast engineers, streaming ops, and incident triage.

**Tagline**: *Live SRT review. Shared decisions.*

---

## Phase 1: Foundation & Authentication

### 1.1 Design System Setup
- Implement dark "operator" theme with locked color palette:
  - Background: `#0B0E14`, Panels: `#131826`, Tiles: `#181F33`
  - Status colors: OK (green), Warning (amber), Error (red), Off (gray)
- Configure typography: Inter (UI), JetBrains Mono (metrics/timestamps)
- Set up responsive breakpoints (desktop-first, 1280px+ optimized)

### 1.2 Authentication (Supabase)
- Email magic link login
- Google OAuth integration
- Session persistence and auth state management
- Protected routes for authenticated sections

### 1.3 Core Navigation Shell
- Fixed left sidebar with icons + labels (Sessions, Create, Join, Settings)
- Collapsible behavior (72px collapsed / 220px expanded)
- Top-left brand block: "TECQ SRT" with "Live Review" subtitle

---

## Phase 2: Database & Data Model

### 2.1 Supabase Tables
- **sessions**: id, owner_id, title, purpose, status (draft/live/ended), timestamps
- **session_inputs**: SRT input configs (mode, host, port, passphrase, latency)
- **session_streams**: playback URLs (WebRTC, LL-HLS) per input
- **session_members**: participants with roles (owner/commenter/viewer)
- **session_invites**: shareable invite tokens with expiry
- **session_notes**: collaborative markdown content with presence
- **session_markers**: QC markers with timestamps and labels
- **stream_metrics_latest**: current video/network/audio metrics (JSON)
- **stream_metrics_points**: time-series data for timeline charts
- **user_roles**: separate role storage (per security requirements)

### 2.2 Row-Level Security
- Owners: full control over their sessions
- Members: access based on role assignment
- Invite-based joining with token validation

---

## Phase 3: Session Management

### 3.1 Dashboard Page
- "My Review Sessions" list with status badges
- "Shared With Me" section
- Quick stats (active sessions, recent activity)
- Create session button

### 3.2 Create Session Flow
- Step 1: Session name + purpose selection
- Step 2: Configure up to 4 SRT inputs
  - Name, position, mode (caller/listener), host, port
  - Optional passphrase (masked input) and latency
- Validation and draft save
- Start session action (calls mock backend)

### 3.3 Join Session Flow
- Enter invite code or link
- Token validation and role assignment
- Redirect to session room

---

## Phase 4: Session Room — Core Experience

### 4.1 Top Status Strip
- LIVE indicator with elapsed time
- Viewer count (real-time presence)
- Input status chips: `1 OK | 2 WARN | 3 OK | 4 OFF`
- Chip click selects stream (without opening inspector)

### 4.2 Multiview Canvas
- Default 2×2 grid layout
- Layout switcher: 2×2, 1+3 right, 1+3 left
- Each tile shows:
  - Stream name + live/warn/error badge
  - Bitrate + packet loss overlays
  - Audio select toggle (single active)
  - Fullscreen button
  - Inspect icon (opens inspector)
- WebRTC video player integration (placeholder tiles with simulated data initially)
- Full-width when inspector is collapsed

### 4.3 Collapsible Inspector Panel
- **Collapsed by default** (multiview gets maximum space)
- Opens via: right-edge chevron, keyboard `I`, inspect icons, marker clicks
- Width: 460–520px (resizable)
- Remembers last active tab per session
- 5 tabs:

#### Tab 1: Stream Details
- Video: codec, resolution, FPS, bitrate
- Network: RTT, packet loss, retransmits, jitter
- 60-second sparkline charts for key metrics

#### Tab 2: Audio Levels
- LUFS-M (momentary), LUFS-S (short-term), LUFS-I (integrated)
- Peak/True Peak display
- Channel layout + sample rate
- Warning badges: HOT (peak > -1dB), LOW (LUFS out of range)

#### Tab 3: Quality Timeline
- Rolling windows: 30s / 2m / 10m
- Stacked mini-charts: bitrate, packet loss, RTT, LUFS-M
- "Now" edge line with auto-refresh
- QC markers as clickable ticks

#### Tab 4: Session Notes
- Realtime collaborative markdown editor
- Presence indicators (who's viewing/editing)
- Insert Timestamp button → `[HH:MM:SS]`
- Add QC Marker → creates timeline marker + note entry

#### Tab 5: People
- Participant list with roles
- Owner controls: invite link, remove participant
- Role badges: Owner / Commenter / Viewer

---

## Phase 5: Real-Time Features

### 5.1 Supabase Realtime
- Notes synchronization across all participants
- Presence tracking (avatars, online status)
- Marker updates (optimistic UI)

### 5.2 Mock Metrics Polling
- Latest metrics: poll every 1 second
- Timeline data: poll every 2 seconds
- Simulated data generators for:
  - Video bitrate (varying around target)
  - Network stats (RTT, loss, jitter)
  - Audio loudness (LUFS + peaks)

### 5.3 Mock Backend API Service
- Create abstracted API layer with mock responses
- Endpoints structure matching your spec:
  - Session lifecycle (create, start, stop)
  - Streams and metrics
  - Markers and invites
- Easy to swap for real backend when ready

---

## Phase 6: Access Control & Roles

### 6.1 Role-Based Permissions
- **Owner**: start/stop session, manage inputs, create invites, remove users
- **Commenter**: add/edit notes, drop QC markers
- **Viewer**: view only (no edit actions)

### 6.2 UI Enforcement
- Conditional rendering of controls based on role
- Action buttons disabled/hidden for insufficient permissions
- Clear role indicators in People tab

---

## Phase 7: Polish & UX Refinements

### 7.1 Keyboard Shortcuts
- `1–4`: Select stream tile
- `F`: Fullscreen selected tile
- `A`: Cycle audio between streams
- `I`: Toggle inspector panel

### 7.2 Responsive Considerations
- Primary: 1920×1080+ desktop
- Secondary: 1366×768 laptops
- Inspector auto-collapses on smaller viewports

### 7.3 Professional Finishing
- No marketing animations or tutorial modals
- Subtle transitions only where functional
- High contrast, scan-friendly layouts
- Broadcast-industry-standard terminology throughout

---

## Landing Page

**Hero Section:**
> **TECQ SRT**
> *Live SRT review. Shared decisions.*
>
> Validate live SRT contribution streams with multiple engineers at once. One ingest. Real-time playback, metrics, audio levels, and shared notes.

**CTAs:**
- Create Review Session
- Join Session

---

## What You'll Get

A fully functional Tecq SRT application with:
- Complete authentication flow
- Dashboard with session management
- 4-stream multiview with simulated playback
- Full inspector panel with all 5 tabs
- Real-time notes and presence
- QC timeline with markers
- Mock data that mirrors your planned API structure
- Production-ready UI matching Haivision-style broadcast aesthetics

When your backend is ready, you'll swap the mock API layer for real endpoints — the UI won't need to change.

