import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Link2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function JoinSession() {
  const navigate = useNavigate();
  const { token: urlToken } = useParams<{ token?: string }>();
  const [inviteCode, setInviteCode] = useState(urlToken || '');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we have a token from URL, attempt to join immediately
    if (urlToken) {
      handleJoin();
    }
  }, [urlToken]);

  const handleJoin = async () => {
    if (!inviteCode.trim()) return;

    setIsJoining(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      // Look up invite by token
      const { data: invite, error: inviteError } = await supabase
        .from('session_invites')
        .select('*, sessions(*)')
        .eq('token', inviteCode.trim())
        .maybeSingle();

      if (inviteError) throw inviteError;

      if (!invite) {
        setError('Invalid invite code. Please check and try again.');
        return;
      }

      // Check if invite has expired
      if (new Date(invite.expires_at) < new Date()) {
        setError('This invite has expired.');
        return;
      }

      // Check if max uses reached
      if (invite.max_uses !== null && invite.use_count >= invite.max_uses) {
        setError('This invite has reached its maximum uses.');
        return;
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from('session_members')
        .select('id')
        .eq('session_id', invite.session_id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (!existingMember) {
        // Add user as member
        const { error: memberError } = await supabase
          .from('session_members')
          .insert({
            session_id: invite.session_id,
            user_id: user.id,
            role: invite.role,
          });

        if (memberError) throw memberError;

        // Increment use count
        await supabase
          .from('session_invites')
          .update({ use_count: invite.use_count + 1 })
          .eq('id', invite.id);
      }

      // Navigate to session
      navigate(`/session/${invite.session_id}`);
    } catch (err) {
      console.error('Failed to join session:', err);
      setError('Failed to join session. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-md mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Join Session</h1>
            <p className="text-sm text-muted-foreground">Enter an invite code to join</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-lg bg-tile border border-border">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-panel mx-auto mb-4">
              <Link2 className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-center text-sm text-muted-foreground mb-6">
              Ask the session owner for an invite link or code
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invite-code">Invite Code</Label>
                <Input
                  id="invite-code"
                  placeholder="Enter invite code..."
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="bg-background font-mono"
                />
              </div>

              {error && (
                <p className="text-sm text-status-error">{error}</p>
              )}

              <Button
                onClick={handleJoin}
                disabled={!inviteCode.trim() || isJoining}
                className="w-full"
              >
                {isJoining ? 'Joining...' : 'Join Session'}
              </Button>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            You'll be added as a viewer or commenter based on the invite settings
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
