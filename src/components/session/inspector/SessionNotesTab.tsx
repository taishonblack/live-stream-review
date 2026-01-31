import { useState, useEffect, useCallback } from 'react';
import { Clock, Flag, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Participant {
  id: string;
  displayName: string;
  isEditing: boolean;
}

interface SessionNotesTabProps {
  content: string;
  onContentChange: (content: string) => void;
  participants: Participant[];
  sessionStartTime: Date | null;
  onAddMarker: (label: string) => void;
  canEdit: boolean;
}

export function SessionNotesTab({
  content,
  onContentChange,
  participants,
  sessionStartTime,
  onAddMarker,
  canEdit,
}: SessionNotesTabProps) {
  const [localContent, setLocalContent] = useState(content);
  const [markerLabel, setMarkerLabel] = useState('');

  // Sync external content changes
  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  // Debounced save
  useEffect(() => {
    if (!canEdit) return;
    const timeout = setTimeout(() => {
      if (localContent !== content) {
        onContentChange(localContent);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [localContent, content, onContentChange, canEdit]);

  const insertTimestamp = useCallback(() => {
    if (!sessionStartTime || !canEdit) return;
    
    const elapsed = Date.now() - sessionStartTime.getTime();
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const timestamp = `[${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}]`;
    
    setLocalContent(prev => prev + (prev.endsWith('\n') || prev === '' ? '' : '\n') + timestamp + ' ');
  }, [sessionStartTime, canEdit]);

  const handleAddMarker = () => {
    if (!markerLabel.trim() || !canEdit) return;
    onAddMarker(markerLabel.trim());
    
    // Also add to notes
    const elapsed = Date.now() - (sessionStartTime?.getTime() || Date.now());
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const timestamp = `[${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}]`;
    
    setLocalContent(prev => 
      prev + (prev.endsWith('\n') || prev === '' ? '' : '\n') + 
      `${timestamp} 🚩 ${markerLabel.trim()}\n`
    );
    setMarkerLabel('');
  };

  const editingParticipants = participants.filter(p => p.isEditing);

  return (
    <div className="flex flex-col h-full">
      {/* Header with presence */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Session Notes</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Collaborative markdown</p>
          </div>
          {participants.length > 0 && (
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-muted-foreground" />
              <div className="flex -space-x-1.5">
                {participants.slice(0, 3).map((p) => (
                  <Avatar key={p.id} className={cn('w-5 h-5 border border-panel', p.isEditing && 'ring-1 ring-primary')}>
                    <AvatarFallback className="text-[8px] bg-tile">
                      {p.displayName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {participants.length > 3 && (
                  <div className="w-5 h-5 rounded-full bg-tile border border-panel flex items-center justify-center">
                    <span className="text-[8px] text-muted-foreground">+{participants.length - 3}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Editing indicator */}
        {editingParticipants.length > 0 && (
          <div className="mt-2 text-[10px] text-muted-foreground">
            {editingParticipants.map(p => p.displayName).join(', ')} {editingParticipants.length === 1 ? 'is' : 'are'} editing...
          </div>
        )}
      </div>

      {/* Action buttons */}
      {canEdit && (
        <div className="p-2 border-b border-border bg-tile/30 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1.5"
            onClick={insertTimestamp}
            disabled={!sessionStartTime}
          >
            <Clock className="w-3.5 h-3.5" />
            Insert Time
          </Button>
          <div className="flex-1 flex items-center gap-1">
            <input
              type="text"
              placeholder="Marker label..."
              value={markerLabel}
              onChange={(e) => setMarkerLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddMarker()}
              className="flex-1 h-7 px-2 text-xs bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1.5"
              onClick={handleAddMarker}
              disabled={!markerLabel.trim()}
            >
              <Flag className="w-3.5 h-3.5" />
              Add Marker
            </Button>
          </div>
        </div>
      )}

      {/* Notes editor */}
      <div className="flex-1 p-4 overflow-hidden">
        <Textarea
          value={localContent}
          onChange={(e) => canEdit && setLocalContent(e.target.value)}
          placeholder={canEdit ? "Add notes, observations, issues..." : "Notes will appear here..."}
          className={cn(
            "h-full resize-none bg-tile border-border font-mono text-xs leading-relaxed",
            !canEdit && "opacity-70 cursor-not-allowed"
          )}
          readOnly={!canEdit}
        />
      </div>
    </div>
  );
}
