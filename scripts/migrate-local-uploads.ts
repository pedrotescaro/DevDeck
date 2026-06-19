import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// Carregar variáveis de ambiente do arquivo .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const connectionString = process.env.DATABASE_URL;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    'Erro: NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configurados no .env.local'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Inicializar o Prisma com o adaptador pg
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  if (!fs.existsSync(uploadDir)) {
    console.log(`Diretório local de uploads não encontrado em: ${uploadDir}`);
    process.exit(0);
  }

  const files = fs.readdirSync(uploadDir);
  console.log(`Encontrados ${files.length} arquivos locais para migrar.`);

  for (const file of files) {
    const filePath = path.join(uploadDir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      continue;
    }

    console.log(`\nProcessando arquivo: ${file}...`);
    const fileBuffer = fs.readFileSync(filePath);

    // Determinar content-type
    const ext = path.extname(file).toLowerCase();
    let contentType = 'image/png';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.svg') contentType = 'image/svg+xml';

    // Fazer upload para o Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(file, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error(`Erro ao fazer upload de ${file}:`, uploadError.message);
      continue;
    }

    // Obter URL pública
    const {
      data: { publicUrl },
    } = supabase.storage.from('uploads').getPublicUrl(file);

    console.log(`Upload concluído! URL pública: ${publicUrl}`);

    const localPath = `/uploads/${file}`;

    // Atualizar mensagens
    const messages = await prisma.message.findMany({
      where: { image_url: localPath },
    });
    if (messages.length > 0) {
      await prisma.message.updateMany({
        where: { image_url: localPath },
        data: { image_url: publicUrl },
      });
      console.log(`-> Atualizadas ${messages.length} mensagens com a URL pública.`);
    }

    // Atualizar posts
    const posts = await prisma.post.findMany({
      where: { image_url: localPath },
    });
    if (posts.length > 0) {
      await prisma.post.updateMany({
        where: { image_url: localPath },
        data: { image_url: publicUrl },
      });
      console.log(`-> Atualizados ${posts.length} posts com a URL pública.`);
    }

    // Atualizar usuários (avatars)
    const users = await prisma.user.findMany({
      where: { avatar_url: localPath },
    });
    if (users.length > 0) {
      await prisma.user.updateMany({
        where: { avatar_url: localPath },
        data: { avatar_url: publicUrl },
      });
      console.log(`-> Atualizados ${users.length} usuários com a URL pública.`);
    }
  }

  console.log('\nMigração concluída com sucesso!');
}

run()
  .catch((e) => {
    console.error('Erro na migração:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
