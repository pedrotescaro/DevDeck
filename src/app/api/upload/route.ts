import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    // Limite de tamanho de 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'O arquivo não pode exceder 5MB' }, { status: 400 });
    }

    // Permitir apenas imagens comuns
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: 'Tipo de arquivo não suportado. Envie apenas imagens (JPEG, PNG, GIF, WebP, SVG).',
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Gerar um nome único e seguro para o arquivo
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const uniqueName = `${Date.now()}-${safeName}`;

    // Inicializar o cliente do Supabase
    const supabase = await createClient();

    // Upload do arquivo para o bucket 'uploads' no Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(uniqueName, buffer, {
        contentType: file.type,
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Erro ao fazer upload da imagem para o armazenamento em nuvem' },
        { status: 500 }
      );
    }

    // Obter a URL pública do arquivo
    const {
      data: { publicUrl },
    } = supabase.storage.from('uploads').getPublicUrl(uniqueName);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Erro ao fazer upload da imagem' }, { status: 500 });
  }
}
