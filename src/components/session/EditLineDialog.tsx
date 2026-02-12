import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { StoredInput } from '@/lib/session-store';

interface EditLineDialogProps {
  input: StoredInput | null;
  open: boolean;
  onClose: () => void;
  onApply: (position: number, patch: Partial<StoredInput>) => void;
}

export function EditLineDialog({ input, open, onClose, onApply }: EditLineDialogProps) {
  const [name, setName] = useState('');
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const [mode, setMode] = useState<'caller' | 'listener'>('caller');
  const [passphrase, setPassphrase] = useState('');
  const [latency, setLatency] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Sync state when input changes
  const resetForm = (i: StoredInput) => {
    setName(i.name);
    setHost(i.host || '');
    setPort(i.port?.toString() || '');
    setMode(i.mode);
    setPassphrase(i.passphrase || '');
    setLatency(i.latency_ms?.toString() || '200');
    setShowPass(false);
  };

  // Reset form when dialog opens with new input
  if (input && open && name === '' && host === '' && port === '') {
    resetForm(input);
  }

  const handleApply = () => {
    if (!input) return;
    onApply(input.position, {
      name: name.trim() || input.name,
      host: host.trim(),
      port: port ? parseInt(port) : null,
      mode,
      passphrase: passphrase.trim() || null,
      latency_ms: latency ? parseInt(latency) : 200,
    });
    onClose();
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
      // Reset tracking state
      setName('');
      setHost('');
      setPort('');
    }
  };

  if (!input) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-panel border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Line {input.position}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-8 bg-background"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Host</Label>
              <Input
                value={host}
                onChange={(e) => setHost(e.target.value)}
                className="h-8 bg-background font-mono text-xs"
                placeholder="srt.example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Port</Label>
              <Input
                value={port}
                onChange={(e) => setPort(e.target.value)}
                className="h-8 bg-background font-mono text-xs"
                placeholder="9000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Mode</Label>
              <Select value={mode} onValueChange={(v) => setMode(v as 'caller' | 'listener')}>
                <SelectTrigger className="h-8 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="caller">Caller</SelectItem>
                  <SelectItem value="listener">Listener</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Latency (ms)</Label>
              <Input
                value={latency}
                onChange={(e) => setLatency(e.target.value)}
                className="h-8 bg-background font-mono text-xs"
                placeholder="200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Passphrase (optional)</Label>
            <div className="relative">
              <Input
                type={showPass ? 'text' : 'password'}
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                className="h-8 bg-background font-mono text-xs pr-10"
                placeholder="••••••••"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-8 w-8"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleApply}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
