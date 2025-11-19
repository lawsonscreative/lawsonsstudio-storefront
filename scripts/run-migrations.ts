/**
 * Migration runner script
 * Applies Supabase migrations manually via SQL
 *
 * Usage: npx tsx scripts/run-migrations.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrations() {
  const migrationsDir = join(process.cwd(), 'supabase/migrations');
  const migrationFiles = readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();

  console.log(`Found ${migrationFiles.length} migration files\n`);

  for (const file of migrationFiles) {
    console.log(`Running migration: ${file}`);
    const filePath = join(migrationsDir, file);
    const sql = readFileSync(filePath, 'utf-8');

    try {
      const { error } = await supabase.rpc('exec_sql', { sql_string: sql });

      if (error) {
        // Try direct query if exec_sql doesn't exist
        const queries = sql.split(';').filter(q => q.trim());
        for (const query of queries) {
          if (query.trim()) {
            const { error: queryError } = await supabase.from('_raw').select(query);
            if (queryError) {
              console.error(`Error in ${file}:`, queryError);
              throw queryError;
            }
          }
        }
      }

      console.log(`✓ ${file} completed\n`);
    } catch (error) {
      console.error(`✗ ${file} failed:`, error);
      throw error;
    }
  }

  console.log('All migrations completed successfully!');
}

runMigrations().catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});
