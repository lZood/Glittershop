'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Package, RefreshCw, Send, Truck, Save, MapPin } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { createSkydropxQuotation, createSkydropxShipment } from "@/app/(admin)/admin/orders/skydropx-actions";

interface SkydropxSheetProps {
    orderId: number;
    totalAmount: number;
    onSuccess: (trackingNumber: string, labelUrl: string) => void;
}

const DEFAULT_SENDER = {
    name: "Glittershop HQ",
    street1: "Av. Ficticia 123",
    zip: "64000",
    city: "Monterrey",
    province: "Nuevo León",
    country: "MX",
    phone: "8180000000",
    email: "ventas@glittershop.com"
};

export function SkydropxSheet({ orderId, totalAmount, onSuccess }: SkydropxSheetProps) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<'form' | 'loading' | 'rates' | 'processing'>('form');

    // Packages & Senders States
    const [savedSenders, setSavedSenders] = useState<any[]>([]);
    const [sender, setSender] = useState(DEFAULT_SENDER);

    const [savedPackages, setSavedPackages] = useState<any[]>([]);
    const [weight, setWeight] = useState(1);
    const [length, setLength] = useState(10);
    const [width, setWidth] = useState(10);
    const [height, setHeight] = useState(10);
    const [pkgName, setPkgName] = useState("");
    const [locName, setLocName] = useState("");

    const [quotationId, setQuotationId] = useState<string>('');
    const [rates, setRates] = useState<any[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (typeof window !== "undefined") {
            const senders = JSON.parse(localStorage.getItem('skydropx_senders') || '[]');
            setSavedSenders(senders.length ? senders : [DEFAULT_SENDER]);
            if (senders.length > 0) setSender(senders[0]);

            const pkgs = JSON.parse(localStorage.getItem('skydropx_packages') || '[]');
            setSavedPackages(pkgs);
        }
    }, [open]);

    const handleSavePackage = () => {
        if (!pkgName) return;
        const newPkg = { name: pkgName, weight, length, width, height };
        const updated = [...savedPackages, newPkg];
        setSavedPackages(updated);
        localStorage.setItem('skydropx_packages', JSON.stringify(updated));
        setPkgName("");
    };

    const handleSaveSender = () => {
        if (!locName) return;
        const newSender = { ...sender, name: locName };
        const updated = [...savedSenders, newSender];
        setSavedSenders(updated);
        localStorage.setItem('skydropx_senders', JSON.stringify(updated));
        setLocName("");
    };

    const loadPackage = (p: any) => {
        setWeight(p.weight);
        setLength(p.length);
        setWidth(p.width);
        setHeight(p.height);
    };

    const loadSender = (s: any) => {
        setSender(s);
    };

    const handleQuote = async () => {
        try {
            setError('');
            setStep('loading');
            const res = await createSkydropxQuotation(orderId, { weight, length, width, height }, sender);
            if (!res.success) throw new Error(res.error || "Skydropx Error");

            setQuotationId(res.quotationId || '');
            setRates(res.rates || []);
            setStep('rates');
        } catch (err: any) {
            setError(err.message);
            setStep('form');
        }
    };

    const handleBuyLabel = async (rateId: string) => {
        try {
            setError('');
            setStep('processing');
            const res = await createSkydropxShipment(orderId, quotationId, rateId, sender);
            if (!res.success) throw new Error(res.error || "Error al emitir guía.");

            onSuccess(res.trackingNumber, res.labelUrl);
            setOpen(false);
            setStep('form');
        } catch (err: any) {
            setError(err.message);
            setStep('rates');
        }
    };

    return (
        <Sheet open={open} onOpenChange={(val) => {
            if (!val && step === 'processing') return;
            setOpen(val);
            if (!val) { setTimeout(() => { setStep('form'); setError(''); }, 500); }
        }}>
            <SheetTrigger asChild>
                <Button className="w-full mt-4 rounded-none h-12 font-bold uppercase tracking-widest text-xs bg-[#4d2db7] hover:bg-[#3d2396] text-white">
                    <Truck className="w-4 h-4 mr-2" /> Cotizar Envío Automatizado
                </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md w-full bg-background overflow-y-auto pt-10 px-6">
                <SheetHeader className="mb-6">
                    <SheetTitle className="font-bold tracking-[0.1em] uppercase text-xl flex items-center gap-2">
                        <Package className="w-5 h-5" /> Envíos Skydropx
                    </SheetTitle>
                    <SheetDescription className="text-muted-foreground uppercase tracking-widest text-[10px] mt-2">
                        Orden #{orderId} - Logística Interna
                    </SheetDescription>
                </SheetHeader>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 border border-red-200 text-xs font-mono mb-6">
                        Excepción: {error}
                    </div>
                )}

                {step === 'form' && (
                    <div className="space-y-6 animate-in fade-in duration-300">

                        {/* ORIGIN SENDER */}
                        <div className="bg-secondary/10 p-4 border border-border">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-primary" /> Dirección de Origen
                            </h3>

                            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                                {savedSenders.map((s, i) => (
                                    <button
                                        key={i}
                                        onClick={() => loadSender(s)}
                                        className={`px-3 py-1.5 border text-xs whitespace-nowrap border-border transition-colors ${sender.street1 === s.street1 ? 'bg-primary text-background font-bold' : 'bg-background hover:bg-secondary'}`}>
                                        {s.name}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div><label className="text-[9px] uppercase tracking-wider text-muted-foreground">Calle (street1)</label>
                                    <Input value={sender.street1} onChange={e => setSender({ ...sender, street1: e.target.value })} className="h-8 text-xs rounded-none" /></div>
                                <div><label className="text-[9px] uppercase tracking-wider text-muted-foreground">CP</label>
                                    <Input value={sender.zip} onChange={e => setSender({ ...sender, zip: e.target.value })} className="h-8 text-xs rounded-none" /></div>
                                <div><label className="text-[9px] uppercase tracking-wider text-muted-foreground">Ciudad</label>
                                    <Input value={sender.city} onChange={e => setSender({ ...sender, city: e.target.value })} className="h-8 text-xs rounded-none" /></div>
                                <div><label className="text-[9px] uppercase tracking-wider text-muted-foreground">Estado</label>
                                    <Input value={sender.province} onChange={e => setSender({ ...sender, province: e.target.value })} className="h-8 text-xs rounded-none" /></div>
                            </div>

                            <div className="flex gap-2">
                                <Input placeholder="Nombre para guardar..." value={locName} onChange={e => setLocName(e.target.value)} className="h-8 text-xs rounded-none" />
                                <Button variant="outline" onClick={handleSaveSender} className="h-8 rounded-none text-xs px-3"><Save className="w-3 h-3" /></Button>
                            </div>
                        </div>

                        {/* PACKAGE SPECS */}
                        <div className="bg-secondary/10 p-4 border border-border">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <Package className="w-3 h-3 text-primary" /> Medidas del Paquete
                            </h3>

                            {savedPackages.length > 0 && (
                                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                                    {savedPackages.map((p, i) => (
                                        <button
                                            key={i}
                                            onClick={() => loadPackage(p)}
                                            className="px-3 py-1.5 border text-xs whitespace-nowrap bg-background hover:bg-secondary border-border transition-colors">
                                            {p.name} ({p.weight}kg)
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="grid grid-cols-4 gap-2 mb-3">
                                <div><label className="text-[9px] uppercase tracking-wider text-muted-foreground">Peso(kg)</label>
                                    <Input type="number" min="0.1" step="0.1" value={weight} onChange={e => setWeight(Number(e.target.value))} className="h-8 text-xs rounded-none px-2" /></div>
                                <div><label className="text-[9px] uppercase tracking-wider text-muted-foreground">Largo</label>
                                    <Input type="number" min="1" value={length} onChange={e => setLength(Number(e.target.value))} className="h-8 text-xs rounded-none px-2" /></div>
                                <div><label className="text-[9px] uppercase tracking-wider text-muted-foreground">Ancho</label>
                                    <Input type="number" min="1" value={width} onChange={e => setWidth(Number(e.target.value))} className="h-8 text-xs rounded-none px-2" /></div>
                                <div><label className="text-[9px] uppercase tracking-wider text-muted-foreground">Alto</label>
                                    <Input type="number" min="1" value={height} onChange={e => setHeight(Number(e.target.value))} className="h-8 text-xs rounded-none px-2" /></div>
                            </div>

                            <div className="flex gap-2">
                                <Input placeholder="Nombre (Ej. Caja Chica)" value={pkgName} onChange={e => setPkgName(e.target.value)} className="h-8 text-xs rounded-none" />
                                <Button variant="outline" onClick={handleSavePackage} className="h-8 rounded-none text-xs px-3"><Save className="w-3 h-3" /></Button>
                            </div>
                        </div>

                        <Button onClick={handleQuote} className="w-full mt-4 rounded-none h-12 font-bold uppercase tracking-widest text-xs">
                            Siguiente: Solicitar Tarifa
                        </Button>
                    </div>
                )}

                {step === 'loading' && (
                    <div className="py-20 flex flex-col items-center justify-center space-y-4 animate-in fade-in">
                        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                        <p className="uppercase tracking-[0.2em] text-xs font-bold text-muted-foreground">Analizando Tarifas...</p>
                        <p className="text-[10px] text-muted-foreground tracking-widest">Crujiendo números en Skydropx</p>
                    </div>
                )}

                {step === 'rates' && (
                    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300 pb-10">
                        <div className="bg-green-50/50 p-4 border border-green-200 text-xs text-green-800 uppercase tracking-widest mb-6">
                            Cotización Exitosa. Selecciona la tarifa deseada.
                        </div>

                        {rates.length === 0 ? (
                            <div className="text-center text-sm text-muted-foreground py-8 border border-dashed border-border">
                                No se encontraron tarifas. Revisa las dimensiones o que la dirección destino del cliente sea válida.
                            </div>
                        ) : (
                            rates.map((rateObj: any) => {
                                const rate = rateObj.attributes || rateObj;
                                const provider = rate.provider_name || rate.provider_display_name || rate.provider || 'Paquetería';
                                const service = rate.provider_service_name || rate.service_level_name || 'Estándar';
                                const amount = rate.total || rate.amount || 0;
                                const days = rate.days || '?';
                                return (
                                    <div key={rateObj.id} className="border border-border/70 p-4 hover:border-black transition-colors bg-background">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-sm uppercase tracking-wider">{provider}</h3>
                                                <p className="text-xs text-muted-foreground">{service} - {days} días</p>
                                            </div>
                                            <span className="font-medium text-lg">
                                                {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount)}
                                            </span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full mt-3 rounded-none text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white"
                                            onClick={() => handleBuyLabel(rateObj.id)}
                                        >
                                            Generar Guía Oficial
                                        </Button>
                                    </div>
                                );
                            })
                        )}
                        <Button variant="ghost" className="w-full mt-4 text-xs tracking-widest uppercase" onClick={() => setStep('form')}>
                            Volver a Modificar Opciones
                        </Button>
                    </div>
                )}

                {step === 'processing' && (
                    <div className="py-20 flex flex-col items-center justify-center space-y-4 animate-in zoom-in duration-300">
                        <Truck className="w-8 h-8 animate-bounce text-primary" />
                        <p className="uppercase tracking-[0.2em] text-xs font-bold text-muted-foreground text-center">
                            Generando Guía y<br />Actualizando Base de Datos...
                        </p>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
