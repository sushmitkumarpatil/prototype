'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function ColorPaletteDemo() {
  return (
    <div className="container mx-auto max-w-6xl p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="font-headline text-4xl font-bold text-primary">Ion Alumni Color Palette</h1>
        <p className="text-muted-foreground text-lg">Modern color system for both light and dark modes</p>
      </div>

      {/* Primary Colors */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Primary Colors</CardTitle>
          <CardDescription className="text-muted-foreground">Main brand colors used throughout the application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="h-20 bg-primary rounded-lg border border-border flex items-center justify-center">
                <span className="text-primary-foreground font-semibold">Primary</span>
              </div>
              <p className="text-sm text-muted-foreground">Main brand color</p>
              <code className="text-xs bg-muted p-1 rounded">bg-primary</code>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-accent rounded-lg border border-border flex items-center justify-center">
                <span className="text-accent-foreground font-semibold">Accent</span>
              </div>
              <p className="text-sm text-muted-foreground">Secondary brand color</p>
              <code className="text-xs bg-muted p-1 rounded">bg-accent</code>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-secondary rounded-lg border border-border flex items-center justify-center">
                <span className="text-secondary-foreground font-semibold">Secondary</span>
              </div>
              <p className="text-sm text-muted-foreground">Supporting color</p>
              <code className="text-xs bg-muted p-1 rounded">bg-secondary</code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Semantic Colors */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Semantic Colors</CardTitle>
          <CardDescription className="text-muted-foreground">Colors with specific meanings and use cases</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-20 bg-success rounded-lg border border-border flex items-center justify-center">
                <span className="text-success-foreground font-semibold">Success</span>
              </div>
              <p className="text-sm text-muted-foreground">Positive actions</p>
              <code className="text-xs bg-muted p-1 rounded">bg-success</code>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-warning rounded-lg border border-border flex items-center justify-center">
                <span className="text-warning-foreground font-semibold">Warning</span>
              </div>
              <p className="text-sm text-muted-foreground">Caution states</p>
              <code className="text-xs bg-muted p-1 rounded">bg-warning</code>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-info rounded-lg border border-border flex items-center justify-center">
                <span className="text-info-foreground font-semibold">Info</span>
              </div>
              <p className="text-sm text-muted-foreground">Information</p>
              <code className="text-xs bg-muted p-1 rounded">bg-info</code>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-destructive rounded-lg border border-border flex items-center justify-center">
                <span className="text-destructive-foreground font-semibold">Destructive</span>
              </div>
              <p className="text-sm text-muted-foreground">Danger actions</p>
              <code className="text-xs bg-muted p-1 rounded">bg-destructive</code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Background Colors */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Background Colors</CardTitle>
          <CardDescription className="text-muted-foreground">Surface and background colors for different contexts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-20 bg-background rounded-lg border border-border flex items-center justify-center">
                <span className="text-foreground font-semibold">Background</span>
              </div>
              <p className="text-sm text-muted-foreground">Main background</p>
              <code className="text-xs bg-muted p-1 rounded">bg-background</code>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-card rounded-lg border border-border flex items-center justify-center">
                <span className="text-card-foreground font-semibold">Card</span>
              </div>
              <p className="text-sm text-muted-foreground">Card surfaces</p>
              <code className="text-xs bg-muted p-1 rounded">bg-card</code>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-popover rounded-lg border border-border flex items-center justify-center">
                <span className="text-popover-foreground font-semibold">Popover</span>
              </div>
              <p className="text-sm text-muted-foreground">Overlay surfaces</p>
              <code className="text-xs bg-muted p-1 rounded">bg-popover</code>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-muted rounded-lg border border-border flex items-center justify-center">
                <span className="text-muted-foreground font-semibold">Muted</span>
              </div>
              <p className="text-sm text-muted-foreground">Subtle backgrounds</p>
              <code className="text-xs bg-muted p-1 rounded">bg-muted</code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart Colors */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Chart Colors</CardTitle>
          <CardDescription className="text-muted-foreground">Colors designed for data visualization and charts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="space-y-2">
                <div className={`h-20 bg-chart-${num} rounded-lg border border-border flex items-center justify-center`}>
                  <span className="text-white font-semibold">Chart {num}</span>
                </div>
                <p className="text-sm text-muted-foreground">Data series {num}</p>
                <code className="text-xs bg-muted p-1 rounded">bg-chart-{num}</code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sidebar Colors */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Sidebar Colors</CardTitle>
          <CardDescription className="text-muted-foreground">Specialized colors for sidebar navigation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-20 bg-sidebar-background rounded-lg border border-border flex items-center justify-center">
                <span className="text-sidebar-foreground font-semibold">Sidebar BG</span>
              </div>
              <p className="text-sm text-muted-foreground">Main sidebar</p>
              <code className="text-xs bg-muted p-1 rounded">bg-sidebar-background</code>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-sidebar-primary rounded-lg border border-border flex items-center justify-center">
                <span className="text-sidebar-primary-foreground font-semibold">Sidebar Primary</span>
              </div>
              <p className="text-sm text-muted-foreground">Active states</p>
              <code className="text-xs bg-muted p-1 rounded">bg-sidebar-primary</code>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-sidebar-accent rounded-lg border border-border flex items-center justify-center">
                <span className="text-sidebar-accent-foreground font-semibold">Sidebar Accent</span>
              </div>
              <p className="text-sm text-muted-foreground">Hover states</p>
              <code className="text-xs bg-muted p-1 rounded">bg-sidebar-accent</code>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-sidebar-border rounded-lg border border-border flex items-center justify-center">
                <span className="text-sidebar-foreground font-semibold">Sidebar Border</span>
              </div>
              <p className="text-sm text-muted-foreground">Dividers</p>
              <code className="text-xs bg-muted p-1 rounded">bg-sidebar-border</code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Usage Examples</CardTitle>
          <CardDescription className="text-muted-foreground">Common patterns and combinations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Buttons */}
          <div className="space-y-3">
            <h4 className="font-semibold text-card-foreground">Buttons</h4>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-primary text-primary-foreground">Primary</Button>
              <Button className="bg-accent text-accent-foreground">Accent</Button>
              <Button className="bg-secondary text-secondary-foreground">Secondary</Button>
              <Button className="bg-success text-success-foreground">Success</Button>
              <Button className="bg-warning text-warning-foreground">Warning</Button>
              <Button className="bg-info text-info-foreground">Info</Button>
              <Button className="bg-destructive text-destructive-foreground">Destructive</Button>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Badges */}
          <div className="space-y-3">
            <h4 className="font-semibold text-card-foreground">Badges</h4>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-primary text-primary-foreground">Primary</Badge>
              <Badge className="bg-accent text-accent-foreground">Accent</Badge>
              <Badge className="bg-success text-success-foreground">Success</Badge>
              <Badge className="bg-warning text-warning-foreground">Warning</Badge>
              <Badge className="bg-info text-info-foreground">Info</Badge>
              <Badge className="bg-destructive text-destructive-foreground">Destructive</Badge>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Cards */}
          <div className="space-y-3">
            <h4 className="font-semibold text-card-foreground">Cards</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Default Card</CardTitle>
                  <CardDescription className="text-muted-foreground">Standard card styling</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">This card uses the default card colors.</p>
                </CardContent>
              </Card>
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-primary">Primary Card</CardTitle>
                  <CardDescription className="text-primary/70">Highlighted content</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-primary/80">This card uses primary color variations.</p>
                </CardContent>
              </Card>
              <Card className="border-accent/50 bg-accent/5">
                <CardHeader>
                  <CardTitle className="text-accent">Accent Card</CardTitle>
                  <CardDescription className="text-accent/70">Special content</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-accent/80">This card uses accent color variations.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Values */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">CSS Custom Properties</CardTitle>
          <CardDescription className="text-muted-foreground">Raw CSS variables for custom implementations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre className="text-muted-foreground">
{`:root {
  --primary: 217 91% 60%;
  --accent: 258 91% 60%;
  --success: 142 76% 36%;
  --warning: 34 97% 56%;
  --info: 217 91% 60%;
  --background: 210 17% 98%;
  --card: 0 0% 100%;
  --muted: 220 14.3% 95.9%;
}

.dark {
  --primary: 217 91% 70%;
  --accent: 258 91% 70%;
  --success: 142 76% 46%;
  --warning: 34 97% 66%;
  --info: 217 91% 70%;
  --background: 220 13% 18%;
  --card: 220 13% 22%;
  --muted: 220 13% 28%;
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
