

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function App() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">Dashboard de Métricas</h1>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Teste do shadcn/ui</CardTitle>
            <CardDescription>
              Verificando se o Tailwind CSS e shadcn/ui estão funcionando corretamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>Botão de Teste</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
