import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Activity, Volume2, LineChart, FileText, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { StreamMetrics, StreamMetricsPoint, SessionMarker, SessionMember, AppRole } from '@/types/session';
import { StreamDetailsTab } from './inspector/StreamDetailsTab';
import { AudioLevelsTab } from './inspector/AudioLevelsTab';
import { QualityTimelineTab } from './inspector/QualityTimelineTab';
import { SessionNotesTab } from './inspector/SessionNotesTab';
import { PeopleTab } from './inspector/PeopleTab';

type InspectorTab = 'details' | 'audio' | 'timeline' | 'notes' | 'people';

interface Participant {
  id: string;
  displayName: string;
  isEditing: boolean;
}

interface InspectorPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedInputName: string;
  selectedInputMetrics: StreamMetrics | null;
  selectedInputHistory: StreamMetricsPoint[];
  markers: SessionMarker[];
  notes: string;
  onNotesChange: (content: string) => void;
  participants: Participant[];
  members: SessionMember[];
  sessionStartTime: Date | null;
  onAddMarker: (label: string) => void;
  currentUserId: string;
  currentUserRole: AppRole;
  inviteLink: string | null;
  onGenerateInvite: (role: AppRole) => void;
  onRemoveMember: (userId: string) => void;
  defaultTab?: InspectorTab;
}

export function InspectorPanel({
  isOpen,
  onToggle,
  selectedInputName,
  selectedInputMetrics,
  selectedInputHistory,
  markers,
  notes,
  onNotesChange,
  participants,
  members,
  sessionStartTime,
  onAddMarker,
  currentUserId,
  currentUserRole,
  inviteLink,
  onGenerateInvite,
  onRemoveMember,
  defaultTab = 'details',
}: InspectorPanelProps) {
  const [activeTab, setActiveTab] = useState<InspectorTab>(defaultTab);
  const canEdit = currentUserRole === 'owner' || currentUserRole === 'commenter';

  // Sync default tab when it changes externally
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  return (
    <>
      {/* Toggle button (always visible on edge) */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className={cn(
          'fixed right-0 top-1/2 -translate-y-1/2 z-50 h-12 w-6 rounded-l-lg rounded-r-none',
          'bg-panel border border-r-0 border-border hover:bg-tile',
          isOpen && 'right-[480px]'
        )}
      >
        {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </Button>

      {/* Panel */}
      <div
        className={cn(
          'fixed right-0 top-12 bottom-0 w-[480px] bg-panel border-l border-border z-40',
          'transition-transform duration-200 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as InspectorTab)} className="h-full flex flex-col">
          <TabsList className="w-full justify-start h-10 bg-tile/50 rounded-none border-b border-border px-2 gap-1">
            <TabsTrigger value="details" className="gap-1.5 text-xs data-[state=active]:bg-primary/10">
              <Activity className="w-3.5 h-3.5" />
              Details
            </TabsTrigger>
            <TabsTrigger value="audio" className="gap-1.5 text-xs data-[state=active]:bg-primary/10">
              <Volume2 className="w-3.5 h-3.5" />
              Audio
            </TabsTrigger>
            <TabsTrigger value="timeline" className="gap-1.5 text-xs data-[state=active]:bg-primary/10">
              <LineChart className="w-3.5 h-3.5" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-1.5 text-xs data-[state=active]:bg-primary/10">
              <FileText className="w-3.5 h-3.5" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="people" className="gap-1.5 text-xs data-[state=active]:bg-primary/10">
              <Users className="w-3.5 h-3.5" />
              People
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="details" className="h-full m-0">
              <StreamDetailsTab
                inputName={selectedInputName}
                metrics={selectedInputMetrics}
                history={selectedInputHistory}
              />
            </TabsContent>
            <TabsContent value="audio" className="h-full m-0">
              <AudioLevelsTab
                inputName={selectedInputName}
                metrics={selectedInputMetrics}
              />
            </TabsContent>
            <TabsContent value="timeline" className="h-full m-0">
              <QualityTimelineTab
                inputName={selectedInputName}
                history={selectedInputHistory}
                markers={markers.filter(m => !m.input_id || m.input_id === selectedInputMetrics?.input_id)}
              />
            </TabsContent>
            <TabsContent value="notes" className="h-full m-0">
              <SessionNotesTab
                content={notes}
                onContentChange={onNotesChange}
                participants={participants}
                sessionStartTime={sessionStartTime}
                onAddMarker={onAddMarker}
                canEdit={canEdit}
              />
            </TabsContent>
            <TabsContent value="people" className="h-full m-0">
              <PeopleTab
                members={members}
                currentUserId={currentUserId}
                currentUserRole={currentUserRole}
                inviteLink={inviteLink}
                onGenerateInvite={onGenerateInvite}
                onRemoveMember={onRemoveMember}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  );
}
