import { Facebook, Instagram, Twitter, Globe, Bot } from 'lucide-react';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '../ui/button';

export default function Footer() {
  const year = new Date().getFullYear();

  const socialIcons = [
    { icon: Facebook, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Bot, href: '#' },
  ];

  return (
    <footer className="bg-background text-foreground border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="md:hidden">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-bold">EXPLORAR GLITTERSHOP</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  <li><Link href="#" className="hover:underline">Colecciones</Link></li>
                  <li><Link href="#" className="hover:underline">Novedades</Link></li>
                  <li><Link href="#" className="hover:underline">Más vendidos</Link></li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="font-bold">AYUDA Y SOPORTE</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  <li><Link href="#" className="hover:underline">Contacto</Link></li>
                  <li><Link href="#" className="hover:underline">Preguntas Frecuentes</Link></li>
                  <li><Link href="#" className="hover:underline">Envíos y Devoluciones</Link></li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="font-bold">INFORMACIÓN LEGAL</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  <li><Link href="#" className="hover:underline">Términos y Condiciones</Link></li>
                  <li><Link href="#" className="hover:underline">Política de Privacidad</Link></li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="font-bold">SOBRE GLITTERSHOP</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                    <li><Link href="#" className="hover:underline">Nuestra Historia</Link></li>
                    <li><Link href="#" className="hover:underline">Carreras</Link></li>
                    <li><Link href="#" className="hover:underline">Prensa</Link></li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="hidden md:grid md:grid-cols-4 gap-8 mb-8">
            <div>
                <h3 className="font-bold mb-4">EXPLORAR GLITTERSHOP</h3>
                <ul className="space-y-2 text-sm">
                    <li><Link href="#" className="hover:underline">Colecciones</Link></li>
                    <li><Link href="#" className="hover:underline">Novedades</Link></li>
                    <li><Link href="#" className="hover:underline">Más vendidos</Link></li>
                </ul>
            </div>
            <div>
                <h3 className="font-bold mb-4">AYUDA Y SOPORTE</h3>
                <ul className="space-y-2 text-sm">
                    <li><Link href="#" className="hover:underline">Contacto</Link></li>
                    <li><Link href="#" className="hover:underline">Preguntas Frecuentes</Link></li>
                    <li><Link href="#" className="hover:underline">Envíos y Devoluciones</Link></li>
                </ul>
            </div>
            <div>
                <h3 className="font-bold mb-4">INFORMACIÓN LEGAL</h3>
                <ul className="space-y-2 text-sm">
                    <li><Link href="#" className="hover:underline">Términos y Condiciones</Link></li>
                    <li><Link href="#" className="hover:underline">Política de Privacidad</Link></li>
                </ul>
            </div>
            <div>
                <h3 className="font-bold mb-4">SOBRE GLITTERSHOP</h3>
                <ul className="space-y-2 text-sm">
                    <li><Link href="#" className="hover:underline">Nuestra Historia</Link></li>
                    <li><Link href="#" className="hover:underline">Carreras</Link></li>
                    <li><Link href="#" className="hover:underline">Prensa</Link></li>
                </ul>
            </div>
        </div>

        <div className="border-t pt-8 mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="flex space-x-2">
                    {socialIcons.map((item, index) => (
                        <Button key={index} variant="outline" size="icon" className="rounded-full">
                            <item.icon className="h-5 w-5" />
                        </Button>
                    ))}
                </div>

                <Button variant="outline" className="rounded-full">
                    <Globe className="h-4 w-4 mr-2" />
                    MÉXICO - español
                </Button>
            </div>
            
            <div className="text-center mt-8">
                <h2 className="text-2xl font-bold mb-2">Glittershop</h2>
                <p className="text-xs text-muted-foreground">
                    &copy; TODOS LOS DERECHOS RESERVADOS. {year} Glittershop
                </p>
            </div>
        </div>
      </div>
    </footer>
  );
}
