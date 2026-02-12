import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Square, Settings, FlaskConical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { StatusStrip } from '@/components/session/StatusStrip';
import { SignalTopologyStrip } from '@/components/session/SignalTopologyStrip';
import { MultiviewCanvas } from '@/components/session/MultiviewCanvas';
import { InspectorPanel } from '@/components/session/InspectorPanel';
import { EditLineDialog } from '@/components/session/EditLineDialog';
import { TecqLogo } from '@/components/brand/TecqLogo';
import { useSessionMetrics } from '@/hooks/use-session-metrics';
import { mockInputConfigs } from '@/lib/mock-data';
import { loadSession, saveSession as saveToLocalStorage, type StoredInput } from '@/lib/session-store';
import { AppRole, SessionMarker, SessionMember, StreamHealth } from '@/types/session';
import { cn } from '@/lib/utils';
import { usePreferences } from '@/hooks/use-preferences';

export default function SessionRoom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { prefs } = usePreferences();

  // Auth state
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<AppRole>('owner'); // Mock as owner for now

  // Session state
  const [sessionTitle, setSessionTitle] = useState('Champions League Feed QC');
  const [isLive, setIsLive] = useState(false);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [viewerCount, setViewerCount] = useState(3);

  // Multiview state
  const [selectedInput, setSelectedInput] = useState<number | null>(1);
  const [activeAudioInput, setActiveAudioInput] = useState<number | null>(1);

  // Inspector state
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [inspectorTab, setInspectorTab] = useState<'details' | 'audio' | 'timeline' | 'notes' | 'people'>('details');

  // Edit line state
  const [editingInput, setEditingInput] = useState<StoredInput | null>(null);

  // Notes and markers
  const [notes, setNotes] = useState('');
  const [markers, setMarkers] = useState<SessionMarker[]>([]);
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  // Mock members
  const [members, setMembers] = useState<SessionMember[]>([]);

  // Generate input IDs for metrics hook
  const inputIds = mockInputConfigs.map((_, i) => `input-${i + 1}`);
  const initialHealth = Object.fromEntries(
    mockInputConfigs.map((c, i) => [`input-${i + 1}`, c.health])
  );

  const { getAllStates, getInputState } = useSessionMetrics({
    inputIds,
    initialHealth,
    enabled: isLive,
  });

  // Restore from localStorage on mount
  useEffect(() => {
    const stored = loadSession(id);
    if (stored) {
      setSessionTitle(stored.title);
      setIsLive(stored.isLive);
      if (stored.startedAt) setStartedAt(new Date(stored.startedAt));
    }
  }, [id]);

  // Persist live state changes
  useEffect(() => {
    const stored = loadSession(id);
    if (stored) {
      saveToLocalStorage({ ...stored, isLive, startedAt: startedAt?.getTime() || null });
    }
  }, [isLive, startedAt, id]);

  // Check auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate('/auth');
      } else {
        setUserId(session.user.id);
        // Mock member data
        setMembers([
          {
            id: '1',
            session_id: id || '',
            user_id: session.user.id,
            role: 'owner',
            joined_at: new Date().toISOString(),
            profile: {
              id: '1',
              user_id: session.user.id,
              display_name: session.user.email?.split('@')[0] || 'You',
              avatar_url: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          },
          {
            id: '2',
            session_id: id || '',
            user_id: 'user-2',
            role: 'commenter',
            joined_at: new Date().toISOString(),
            profile: {
              id: '2',
              user_id: 'user-2',
              display_name: 'John Smith',
              avatar_url: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          },
          {
            id: '3',
            session_id: id || '',
            user_id: 'user-3',
            role: 'viewer',
            joined_at: new Date().toISOString(),
            profile: {
              id: '3',
              user_id: 'user-3',
              display_name: 'Jane Doe',
              avatar_url: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          },
        ]);
      }
    });
  }, [navigate, id]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case '1':
        case '2':
        case '3':
        case '4':
          e.preventDefault();
          setSelectedInput(parseInt(e.key));
          break;
        case 'i':
        case 'I':
          e.preventDefault();
          setInspectorOpen((prev) => !prev);
          break;
        case 'a':
        case 'A':
          e.preventDefault();
          setActiveAudioInput((prev) => {
            const next = (prev || 0) % 4 + 1;
            return next;
          });
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          if (selectedInput) {
            const tile = document.querySelector(`[data-stream-position="${selectedInput}"]`);
            if (tile && document.fullscreenEnabled) {
              tile.requestFullscreen?.();
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedInput]);

  const handleInspect = useCallback((position: number) => {
    setSelectedInput(position);
    setInspectorOpen(true);
    setInspectorTab('details');
  }, []);

  const handleAddMarker = useCallback((label: string) => {
    const elapsed = Date.now() - (startedAt?.getTime() || Date.now());
    const newMarker: SessionMarker = {
      id: crypto.randomUUID(),
      session_id: id || '',
      input_id: selectedInput ? `input-${selectedInput}` : null,
      timestamp_ms: elapsed,
      label,
      severity: 'warning',
      note: null,
      created_by: userId,
      created_at: new Date().toISOString(),
    };
    setMarkers((prev) => [...prev, newMarker]);
  }, [startedAt, id, selectedInput, userId]);

  const handleGenerateInvite = useCallback((role: AppRole) => {
    const token = crypto.randomUUID().slice(0, 8);
    setInviteLink(`${window.location.origin}/join/${token}`);
  }, []);

  const handleRemoveMember = useCallback((memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.user_id !== memberId));
  }, []);

  const handleEditLine = useCallback((position: number) => {
    const stored = loadSession(id);
    if (stored) {
      const input = stored.inputs.find(i => i.position === position);
      if (input) setEditingInput(input);
    }
  }, [id]);

  const handleApplyEdit = useCallback((position: number, patch: Partial<StoredInput>) => {
    const stored = loadSession(id);
    if (stored) {
      stored.inputs = stored.inputs.map(i => i.position === position ? { ...i, ...patch } : i);
      saveToLocalStorage(stored);
    }
  }, [id]);

  // Build inputs data for multiview
  const allStates = getAllStates();
  const inputs = mockInputConfigs.map((config, i) => {
    const state = getInputState(`input-${i + 1}`);
    return {
      id: `input-${i + 1}`,
      position: config.position,
      name: config.name,
      health: state?.health || config.health,
      metrics: state?.metrics || null,
    };
  });

  const statusChips = inputs.map((input) => ({
    position: input.position,
    name: input.name,
    health: input.health,
  }));

  const selectedState = selectedInput ? getInputState(`input-${selectedInput}`) : null;
  const selectedInputData = selectedInput ? inputs.find((i) => i.position === selectedInput) : null;

  const participants = members.map((m) => ({
    id: m.user_id,
    displayName: m.profile?.display_name || 'Unknown',
    isEditing: false,
  }));

  return (
    <div className={cn('h-screen flex flex-col bg-background overflow-hidden', prefs.showMetroBackground && 'metro-bg')}>
      {/* Top bar with back button and session controls */}
      <div className="h-12 bg-panel/90 backdrop-blur-sm border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <TecqLogo size="sm" showSubtitle={false} />
        </div>
        <div className="flex items-center gap-2">
          {/* Dev-only simulated live toggle */}
          <Button
            variant={isLive ? 'default' : 'outline'}
            size="sm"
            className={cn(
              'h-8 gap-1.5 font-mono text-xs',
              isLive && 'bg-status-ok/20 text-status-ok border border-status-ok/30 hover:bg-status-ok/30'
            )}
            onClick={() => {
              if (!isLive) {
                setIsLive(true);
                setStartedAt(new Date());
              } else {
                setIsLive(false);
              }
            }}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            {isLive ? 'SIM LIVE' : 'Simulate'}
          </Button>

          <div className="w-px h-6 bg-border" />

          {userRole === 'owner' && (
            <>
              {isLive ? (
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 gap-1.5"
                  onClick={() => setIsLive(false)}
                >
                  <Square className="w-3.5 h-3.5" />
                  End Session
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="h-8 gap-1.5"
                  onClick={() => {
                    setIsLive(true);
                    setStartedAt(new Date());
                  }}
                >
                  <Play className="w-3.5 h-3.5" />
                  Start Session
                </Button>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Status strip */}
      <StatusStrip
        sessionTitle={sessionTitle}
        isLive={isLive}
        startedAt={startedAt}
        viewerCount={viewerCount}
        statusChips={statusChips}
        selectedInput={selectedInput}
        onInputSelect={setSelectedInput}
      />

      {/* Signal topology strip */}
      {prefs.showSignalTopology && (
        <SignalTopologyStrip
          inputs={statusChips}
          viewerCount={viewerCount}
          isLive={isLive}
        />
      )}

      {/* Main content area */}
      <div className={cn('flex-1 overflow-hidden', inspectorOpen && 'mr-[480px]')}>
        <MultiviewCanvas
          inputs={inputs}
          selectedInput={selectedInput}
          activeAudioInput={activeAudioInput}
          onInputSelect={setSelectedInput}
          onAudioSelect={setActiveAudioInput}
          onInspect={handleInspect}
          onEditLine={handleEditLine}
        />
      </div>

      {/* Inspector panel */}
      <InspectorPanel
        isOpen={inspectorOpen}
        onToggle={() => setInspectorOpen((prev) => !prev)}
        selectedInputName={selectedInputData?.name || 'No input selected'}
        selectedInputMetrics={selectedState?.metrics || null}
        selectedInputHistory={selectedState?.history || []}
        markers={markers}
        notes={notes}
        onNotesChange={setNotes}
        participants={participants}
        members={members}
        sessionStartTime={startedAt}
        onAddMarker={handleAddMarker}
        currentUserId={userId || ''}
        currentUserRole={userRole}
        inviteLink={inviteLink}
        onGenerateInvite={handleGenerateInvite}
        onRemoveMember={handleRemoveMember}
        defaultTab={inspectorTab}
      />

      {/* Edit line dialog */}
      <EditLineDialog
        input={editingInput}
        open={!!editingInput}
        onClose={() => setEditingInput(null)}
        onApply={handleApplyEdit}
      />
    </div>
  );
}
