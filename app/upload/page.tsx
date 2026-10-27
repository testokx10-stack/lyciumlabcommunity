import Link from 'next/link';
import { Card } from '@/components/ui/card';

export default function UploadPage() {
  return (
    <div className="container-px mx-auto max-w-2xl py-16">
      <Card className="p-8 text-center">
        <h1 className="font-display text-2xl font-semibold">Dépôt de fichiers non ouvert</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          L’envoi de fichiers n’est pas encore disponible. Les contrôles de stockage, de taille, de modération et de droits doivent être vérifiés avant son ouverture.
        </p>
        <Link href="/community" className="mt-5 inline-block text-primary underline underline-offset-4">
          Participer à la communauté par écrit
        </Link>
      </Card>
    </div>
  );
}
