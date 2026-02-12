import { AppLayout } from '@/components/layout/AppLayout';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { usePreferences } from '@/hooks/use-preferences';

export default function Settings() {
  const { prefs, setPref } = usePreferences();

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto py-12 px-6 space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Customise your workspace appearance.</p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="metro-bg" className="flex flex-col gap-1 cursor-pointer">
              <span className="text-sm font-medium text-foreground">Show metro background</span>
              <span className="text-xs text-muted-foreground">Display the metro-map pattern across pages.</span>
            </Label>
            <Switch
              id="metro-bg"
              checked={prefs.showMetroBackground}
              onCheckedChange={(v) => setPref('showMetroBackground', v)}
            />
          </div>

          <div className="w-full h-px bg-border" />

          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="topology" className="flex flex-col gap-1 cursor-pointer">
              <span className="text-sm font-medium text-foreground">Show signal topology strip</span>
              <span className="text-xs text-muted-foreground">Display the signal-flow schematic in the session room.</span>
            </Label>
            <Switch
              id="topology"
              checked={prefs.showSignalTopology}
              onCheckedChange={(v) => setPref('showSignalTopology', v)}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
