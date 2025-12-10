import { Header } from '@/components/studio'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SettingsPage() {
  return (
    <>
      <Header title="Paramètres" subtitle="Configuration de votre espace" />

      <div className="p-6 max-w-2xl space-y-6">
        {/* Profil */}
        <Card>
          <CardHeader>
            <CardTitle>Profil</CardTitle>
            <CardDescription>
              Informations de votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" disabled placeholder="admin@example.com" />
            </div>
          </CardContent>
        </Card>

        {/* Branding */}
        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
            <CardDescription>
              Personnalisez l'apparence du questionnaire
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Logo</Label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
                  <span className="text-xs text-slate-400">Logo</span>
                </div>
                <Button variant="outline">Changer</Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="company">Nom de l'entreprise</Label>
              <Input id="company" placeholder="Votre entreprise" />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Zone dangereuse</CardTitle>
            <CardDescription>
              Actions irréversibles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">Supprimer toutes les données</Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
