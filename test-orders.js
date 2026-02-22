const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
    'https://aylnczeyemqdnhhqczzi.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bG5jemV5ZW1xZG5oaHFjenppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTE4Mjg2MywiZXhwIjoyMDc2NzU4ODYzfQ.MWC5qTcGonWUDCoMk9E7-lDGOEVhNznGyNNuIzhVUfI'
);

async function main() {
    const { data, error } = await supabase.from('orders').select('*, order_items(*, product:products(*, product_images(*)))').order('created_at', { ascending: false }).limit(1);
    fs.writeFileSync('test-output.json', JSON.stringify(data, null, 2));
}

main();
