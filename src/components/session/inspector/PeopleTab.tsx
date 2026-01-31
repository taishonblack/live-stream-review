import { useState } from 'react';
import { Copy, Check, UserMinus, Crown, MessageSquare, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { AppRole, SessionMember } from '@/types/session';

interface PeopleTabProps {
  members: SessionMember[];
  currentUserId: string;
  currentUserRole: AppRole;
  inviteLink: string | null;
  onGenerateInvite: (role: AppRole) => void;
  onRemoveMember: (userId: string) => void;
}

export function PeopleTab({
  members,
  currentUserId,
  currentUserRole,
  inviteLink,
  onGenerateInvite,
  onRemoveMember,
}: PeopleTabProps) {
  const [copied, setCopied] = useState(false);
  const [selectedInviteRole, setSelectedInviteRole] = useState<AppRole>('viewer');
  const isOwner = currentUserRole === 'owner';

  const handleCopyLink = async () => {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRoleIcon = (role: AppRole) => {
    switch (role) {
      case 'owner': return <Crown className="w-3.5 h-3.5" />;
      case 'commenter': return <MessageSquare className="w-3.5 h-3.5" />;
      case 'viewer': return <Eye className="w-3.5 h-3.5" />;
    }
  };

  const getRoleBadge = (role: AppRole) => {
    const variants: Record<AppRole, string> = {
      owner: 'bg-primary/20 text-primary border-primary/30',
      commenter: 'bg-status-warning/20 text-status-warning border-status-warning/30',
      viewer: 'bg-muted text-muted-foreground border-border',
    };
    return (
      <Badge variant="outline" className={cn('text-[10px] gap-1', variants[role])}>
        {getRoleIcon(role)}
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">People</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{members.length} participant{members.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Invite section (owner only) */}
      {isOwner && (
        <div className="p-4 border-b border-border bg-tile/30">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Invite Link
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Select value={selectedInviteRole} onValueChange={(v) => setSelectedInviteRole(v as AppRole)}>
                <SelectTrigger className="h-8 text-xs flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="commenter">Commenter</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="sm"
                className="h-8 text-xs"
                onClick={() => onGenerateInvite(selectedInviteRole)}
              >
                Generate
              </Button>
            </div>
            {inviteLink && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inviteLink}
                  readOnly
                  className="flex-1 h-8 px-2 text-xs bg-background border border-border rounded font-mono truncate"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleCopyLink}
                >
                  {copied ? <Check className="w-4 h-4 text-status-ok" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Participants list */}
      <div className="flex-1 p-4 overflow-auto">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Participants
        </h4>
        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member.id}
              className={cn(
                'flex items-center justify-between p-2 rounded-lg bg-tile',
                member.user_id === currentUserId && 'ring-1 ring-primary/30'
              )}
            >
              <div className="flex items-center gap-2">
                <Avatar className="w-7 h-7">
                  <AvatarFallback className="text-[10px] bg-background">
                    {(member.profile?.display_name || 'U').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    {member.profile?.display_name || 'Unknown User'}
                    {member.user_id === currentUserId && (
                      <span className="text-[10px] text-muted-foreground">(you)</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getRoleBadge(member.role)}
                {isOwner && member.role !== 'owner' && member.user_id !== currentUserId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-status-error"
                    onClick={() => onRemoveMember(member.user_id)}
                  >
                    <UserMinus className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
