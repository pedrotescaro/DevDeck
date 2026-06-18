import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Gerar um nome único e seguro para o arquivo
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const uniqueName = `${Date.now()}-${safeName}`;
    const publicDir = join(process.cwd(), 'public');
    const uploadDir = join(publicDir, 'uploads');

    // Garantir que a pasta public/uploads existe
    await mkdir(uploadDir, { recursive: true });

    const filePath = join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${uniqueName}` });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Erro ao fazer upload da imagem' }, { status: 500 });
  }
}
