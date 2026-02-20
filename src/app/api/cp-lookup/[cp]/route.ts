import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ cp: string }> }
) {
    const { cp } = await params;
    console.log(`[cp-lookup] Consultando CP: ${cp}`);

    // Validate format
    if (!/^\d{5}$/.test(cp)) {
        console.log(`[cp-lookup] Formato inválido: "${cp}"`);
        return NextResponse.json({ error: 'Formato de CP inválido' }, { status: 400 });
    }

    const token = process.env.COPOMEX_TOKEN;
    console.log(`[cp-lookup] Token: ${token ? `${token.substring(0, 6)}...` : '❌ NO CONFIGURADO'}`);

    if (!token || token === 'TU_TOKEN_AQUI') {
        console.error('[cp-lookup] ❌ COPOMEX_TOKEN no está configurado en .env.local');
        return NextResponse.json(
            { error: 'Token de COPOMEX no configurado. Agrega COPOMEX_TOKEN en .env.local' },
            { status: 500 }
        );
    }

    const url = `https://api.copomex.com/query/info_cp/${cp}?type=simplified&token=${token}`;
    console.log(`[cp-lookup] Llamando a COPOMEX: ${url.replace(token, '***')}`);

    try {
        const res = await fetch(url, {
            cache: 'force-cache',
            next: { revalidate: 86400 }, // Cache 24h — CP data rarely changes
        });

        console.log(`[cp-lookup] HTTP status de COPOMEX: ${res.status}`);

        const raw = await res.text();
        console.log(`[cp-lookup] Respuesta raw (primeros 400 chars): ${raw.substring(0, 400)}`);

        if (!res.ok) {
            return NextResponse.json(
                { error: `COPOMEX respondió con status ${res.status}` },
                { status: 404 }
            );
        }

        let data: { error: boolean; code_error: number; error_message: string | null; response: { cp: string; asentamiento: string | string[]; tipo_asentamiento: string; municipio: string; estado: string; ciudad: string; pais: string } };
        try {
            data = JSON.parse(raw);
        } catch {
            console.error('[cp-lookup] ❌ Error parseando JSON:', raw);
            return NextResponse.json({ error: 'Respuesta inválida de COPOMEX' }, { status: 500 });
        }

        console.log(`[cp-lookup] data.error=${data.error}, code_error=${data.code_error}`);

        if (data.error) {
            console.log(`[cp-lookup] COPOMEX devolvió error: ${data.error_message}`);
            return NextResponse.json(
                { error: data.error_message || 'CP no encontrado' },
                { status: 404 }
            );
        }

        const r = data.response;
        const colonias = Array.isArray(r.asentamiento) ? r.asentamiento : [r.asentamiento];

        console.log(`[cp-lookup] ✅ estado="${r.estado}", ciudad="${r.ciudad}", municipio="${r.municipio}", colonias(${colonias.length})=${JSON.stringify(colonias)}`);

        return NextResponse.json({
            cp: r.cp,
            estado: r.estado,
            ciudad: r.ciudad || r.municipio,
            municipio: r.municipio,
            colonias,
        });
    } catch (err) {
        console.error('[cp-lookup] ❌ Error de red al llamar COPOMEX:', err);
        return NextResponse.json({ error: 'Error al conectar con COPOMEX' }, { status: 500 });
    }
}
