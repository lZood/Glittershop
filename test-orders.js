const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
    'https://aylnczeyemqdnhhqczzi.supabase.co',
    '***REMOVED***'
);

async function main() {
    const { data, error } = await supabase.from('orders').select('*, order_items(*, product:products(*, product_images(*)))').order('created_at', { ascending: false }).limit(1);
    fs.writeFileSync('test-output.json', JSON.stringify(data, null, 2));
}

main();
