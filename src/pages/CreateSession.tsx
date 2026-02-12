import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { saveSession as saveToLocalStorage, type StoredSession } from '@/lib/session-store';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { SrtMode } from '@/types/session';

interface SrtInputConfig {
  position: number;
  name: string;
  mode: SrtMode;
  host: string;
  port: string;
  passphrase: string;
  latency: string;
  enabled: boolean;
}

const purposes = ['QC', 'Vendor Test', 'Incident', 'Training', 'Other'];

export default function CreateSession() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Session details
  const [sessionName, setSessionName] = useState('');
  const [purpose, setPurpose] = useState('QC');

  // Step 2: SRT inputs
  const [inputs, setInputs] = useState<SrtInputConfig[]>([
    { position: 1, name: 'Input 1', mode: 'caller', host: '', port: '9000', passphrase: '', latency: '200', enabled: true },
  ]);

  const [showPassphrase, setShowPassphrase] = useState<Record<number, boolean>>({});

  const addInput = () => {
    if (inputs.length >= 4) return;
    const nextPosition = inputs.length + 1;
    setInputs([
      ...inputs,
      { position: nextPosition, name: `Input ${nextPosition}`, mode: 'caller', host: '', port: '9000', passphrase: '', latency: '200', enabled: true },
    ]);
  };

  const removeInput = (position: number) => {
    setInputs(inputs.filter((i) => i.position !== position).map((i, idx) => ({ ...i, position: idx + 1 })));
  };

  const updateInput = (position: number, field: keyof SrtInputConfig, value: string | boolean) => {
    setInputs(inputs.map((i) => (i.position === position ? { ...i, [field]: value } : i)));
  };

  const handleCreate = async () => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      // Create session
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .insert({
          owner_id: user.id,
          title: sessionName,
          purpose,
          status: 'draft',
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Create inputs
      const inputsData = inputs.filter(i => i.enabled).map((i) => ({
        session_id: session.id,
        position: i.position,
        name: i.name,
        mode: i.mode,
        host: i.host || null,
        port: i.port ? parseInt(i.port) : null,
        passphrase: i.passphrase || null,
        latency_ms: i.latency ? parseInt(i.latency) : 200,
        enabled: true,
      }));

      if (inputsData.length > 0) {
        const { error: inputsError } = await supabase.from('session_inputs').insert(inputsData);
        if (inputsError) throw inputsError;
      }

      // Save to localStorage for persistence across refresh
      const stored: StoredSession = {
        id: session.id,
        title: sessionName,
        purpose,
        createdAt: Date.now(),
        inputs: inputs.filter(i => i.enabled).map(i => ({
          position: i.position,
          name: i.name,
          mode: i.mode,
          host: i.host,
          port: i.port ? parseInt(i.port) : null,
          passphrase: i.passphrase || null,
          latency_ms: i.latency ? parseInt(i.latency) : 200,
          enabled: true,
        })),
        isLive: false,
        startedAt: null,
      };
      saveToLocalStorage(stored);

      navigate(`/session/${session.id}`);
    } catch (error) {
      console.error('Failed to create session:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedStep1 = sessionName.trim().length > 0;
  const canProceedStep2 = inputs.some((i) => i.enabled && i.name.trim());

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Create Review Session</h1>
            <p className="text-sm text-muted-foreground">Step {step} of 2</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          <div className={cn('h-1 flex-1 rounded-full', step >= 1 ? 'bg-primary' : 'bg-muted')} />
          <div className={cn('h-1 flex-1 rounded-full', step >= 2 ? 'bg-primary' : 'bg-muted')} />
        </div>

        {/* Step 1: Session details */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="session-name">Session Name</Label>
              <Input
                id="session-name"
                placeholder="e.g., Champions League Feed QC"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="bg-tile"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger className="bg-tile">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {purposes.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={() => setStep(2)} disabled={!canProceedStep1} className="gap-2">
                Next: Configure Inputs
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: SRT Inputs */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">SRT Inputs</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={addInput}
                disabled={inputs.length >= 4}
                className="gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add Input
              </Button>
            </div>

            <div className="space-y-4">
              {inputs.map((input) => (
                <div
                  key={input.position}
                  className="p-4 rounded-lg bg-tile border border-border space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs bg-panel px-2 py-1 rounded">
                        {input.position}
                      </span>
                      <Input
                        value={input.name}
                        onChange={(e) => updateInput(input.position, 'name', e.target.value)}
                        className="h-8 w-40 bg-background"
                        placeholder="Input name"
                      />
                    </div>
                    {inputs.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-status-error"
                        onClick={() => removeInput(input.position)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Mode</Label>
                      <Select
                        value={input.mode}
                        onValueChange={(v) => updateInput(input.position, 'mode', v)}
                      >
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
                        value={input.latency}
                        onChange={(e) => updateInput(input.position, 'latency', e.target.value)}
                        className="h-8 bg-background"
                        placeholder="200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Host</Label>
                      <Input
                        value={input.host}
                        onChange={(e) => updateInput(input.position, 'host', e.target.value)}
                        className="h-8 bg-background font-mono text-xs"
                        placeholder="e.g., srt.example.com"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Port</Label>
                      <Input
                        value={input.port}
                        onChange={(e) => updateInput(input.position, 'port', e.target.value)}
                        className="h-8 bg-background font-mono text-xs"
                        placeholder="9000"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Passphrase (optional)</Label>
                    <div className="relative">
                      <Input
                        type={showPassphrase[input.position] ? 'text' : 'password'}
                        value={input.passphrase}
                        onChange={(e) => updateInput(input.position, 'passphrase', e.target.value)}
                        className="h-8 bg-background font-mono text-xs pr-10"
                        placeholder="••••••••"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-8 w-8"
                        onClick={() =>
                          setShowPassphrase((prev) => ({
                            ...prev,
                            [input.position]: !prev[input.position],
                          }))
                        }
                      >
                        {showPassphrase[input.position] ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!canProceedStep2 || isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? 'Creating...' : 'Create Session'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
