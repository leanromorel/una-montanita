export type Producto = {
  id: number;
  nombre: string;
  desc: string;
  precio: number;
  stock: number;
  img: number;
};

export const productos: Producto[] = [
  {
    id: 1,
    nombre: 'Canarias Tradicional',
    desc: 'Yerba mate elaborada con hojas seleccionadas y estacionamiento adecuado. Sabor intenso y rendimiento alto.',
    precio: 9800,
    stock: 4,
    img: require('@/assets/productos/canarias-tradicional.jpg'),
  },
  {
    id: 2,
    nombre: 'Canarias Edición Especial',
    desc: 'Hojas de montes nativos con manejo sustentable. Estacionamiento prolongado y molienda uniforme. Sabor moderado, parejo y levemente ahumado.',
    precio: 11000,
    stock: 0,
    img: require('@/assets/productos/canarias-especial.jpg'),
  },
  {
    id: 3,
    nombre: 'Canarias Serena',
    desc: 'Mezcla suave con hierbas: toronjil, mburucuyá, menta y tilo. Mantiene el sabor del mate pero con menor intensidad.',
    precio: 10800,
    stock: 0,
    img: require('@/assets/productos/canarias-serena.jpg'),
  },
  {
    id: 4,
    nombre: 'Canarias Té Verde y Jengibre',
    desc: 'Yerba con té verde (antioxidante) y jengibre (digestivo). No se recomienda su uso prolongado ni para niños.',
    precio: 11000,
    stock: 4,
    img: require('@/assets/productos/canarias-teverde.jpg'),
  },
  {
    id: 5,
    nombre: 'Canarias Té Rojo y Centellas',
    desc: 'Yerba con té rojo (apoyo en pérdida de peso) y centella (piel y celulitis). No para embarazadas, lactancia ni uso prolongado.',
    precio: 11000,
    stock: 1,
    img: require('@/assets/productos/canarias-terojo.jpg'),
  },
  {
    id: 6,
    nombre: 'Canarias Suave',
    desc: 'Yerba mate suave y ligera, ideal para quienes prefieren un sabor más amigable sin perder el cuerpo y rendimiento característico de Canarias. Molienda fina tipo uruguaya, sin palo.',
    precio: 11200,
    stock: 0,
    img: require('@/assets/productos/canarias-suave.jpg'),
  },
  {
    id: 7,
    nombre: 'Baldo',
    desc: 'Yerba 100% hoja, sin polvo ni palo. Molienda fina que mejora la infusión y es más amigable para el sistema digestivo.',
    precio: 10000,
    stock: 0,
    img: require('@/assets/productos/baldo.jpg'),
  },
  {
    id: 8,
    nombre: 'Rei Verde Tradicional',
    desc: 'Yerba mate uruguaya de padrón exportación. Sabor tradicional, suave y equilibrado. Ideal para el mate del día a día.',
    precio: 8800,
    stock: 0,
    img: require('@/assets/productos/rei-verde-tradicional.jpg'),
  },
  {
    id: 9,
    nombre: 'Rei Verde Premium',
    desc: 'Línea premium de Rei Verde con selección especial de hojas. Mayor suavidad y aroma. Una experiencia de mate de nivel superior.',
    precio: 9200,
    stock: 0,
    img: require('@/assets/productos/rei-verde-premium.jpg'),
  },
];
