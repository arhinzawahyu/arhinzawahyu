// Utilitas dev: menampilkan tabel yang ada di database aktif.
import "dotenv/config";
import postgres from "postgres";

const koneksi = postgres(process.env.DATABASE_URL ?? "", { prepare: false });

const tabel = await koneksi`
  select table_name from information_schema.tables
  where table_schema = 'public' order by table_name
`;
console.log(tabel.length === 0 ? "(belum ada tabel)" : tabel.map((t) => t.table_name).join(", "));
await koneksi.end();
