-- ==========================================================
-- 1. CREACIÓN DE TABLA DE AUTENTICACIÓN (PERFILES)
-- ==========================================================
-- Crea la tabla pública que se enlazará uno-a-uno con los usuarios seguros de Supabase
CREATE TABLE perfiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  es_admin BOOLEAN DEFAULT true, -- Por defecto es admin ya que solo la dueña tendrá cuenta
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (RLS) en los perfiles
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;

-- Política: Un administrador solo puede ver su propio perfil
CREATE POLICY "Admins pueden ver su perfil"
  ON perfiles FOR SELECT
  TO authenticated
  USING ( auth.uid() = id );

-- ==========================================================
-- 2. TRIGGER AUTOMÁTICO PARA SUPABASE AUTH
-- ==========================================================
-- Esta función se ejecuta sola cada vez que creas un usuario en el panel de Supabase
CREATE OR REPLACE FUNCTION public.crear_perfil_nuevo_usuario()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.perfiles (id, email, es_admin)
  VALUES (new.id, new.email, true);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enlazar la función a la tabla secreta auth.users
CREATE TRIGGER al_crear_usuario
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.crear_perfil_nuevo_usuario();

-- ==========================================================
-- 3. CREACIÓN DE LA TABLA DE PRODUCTOS
-- ==========================================================
CREATE TABLE productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  categoria TEXT NOT NULL,
  precio INTEGER NOT NULL,
  imagen_url TEXT NOT NULL,
  disponible BOOLEAN DEFAULT true,
  destacado BOOLEAN DEFAULT false,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

-- Política: Todos los usuarios (público) pueden VER los productos
CREATE POLICY "Productos visibles para todos" ON productos FOR SELECT USING ( true );

-- Políticas: Solo administradores (autenticados) pueden modificar el catálogo
CREATE POLICY "Creación reservada a admins" ON productos FOR INSERT TO authenticated WITH CHECK ( true );
CREATE POLICY "Actualización reservada a admins" ON productos FOR UPDATE TO authenticated USING ( true ) WITH CHECK ( true );
CREATE POLICY "Eliminación reservada a admins" ON productos FOR DELETE TO authenticated USING ( true );

-- ==========================================================
-- 4. CONFIGURACIÓN DEL STORAGE (IMÁGENES DE PRODUCTOS)
-- ==========================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('productos', 'productos', true) 
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage:
CREATE POLICY "Visualización pública de imágenes" ON storage.objects FOR SELECT USING ( bucket_id = 'productos' );
CREATE POLICY "Solo admins pueden subir imágenes" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'productos' );
CREATE POLICY "Solo admins pueden actualizar imágenes" ON storage.objects FOR UPDATE TO authenticated USING ( bucket_id = 'productos' );
CREATE POLICY "Solo admins pueden borrar imágenes" ON storage.objects FOR DELETE TO authenticated USING ( bucket_id = 'productos' );

-- ==========================================================
-- 5. DATOS DE EJEMPLO (SEED) - SECCIÓN OPCIONAL
-- ==========================================================
INSERT INTO productos (nombre, categoria, precio, imagen_url, disponible, destacado) VALUES
('Letra M con Rosas', 'Llaveros', 35000, 'https://images.unsplash.com/photo-1627384113972-f4c03d27935b?q=80&w=400&auto=format&fit=crop', true, true),
('Placa Huella Galaxia', 'Mascotas', 25000, 'https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?q=80&w=400&auto=format&fit=crop', true, true),
('Separador Floral Verde', 'Lectura', 22000, 'https://images.unsplash.com/photo-1627384114006-259163ef27c6?q=80&w=400&auto=format&fit=crop', true, true),
('Placa Mascota Galaxy', 'Mascotas', 28000, 'https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=400&auto=format&fit=crop', true, true),
('Portavasos Ámbar Set', 'Hogar', 65000, 'https://images.unsplash.com/photo-1610708687313-2be2b1a8d56b?q=80&w=400&auto=format&fit=crop', true, true),
('Llavero Inicial Floral', 'Llaveros', 25000, 'https://images.unsplash.com/photo-1627384113972-f4c03d27935b?auto=format&fit=crop&q=80&w=400', true, false),
('Portavasos Océano', 'Hogar', 45000, 'https://images.unsplash.com/photo-1610708687313-2be2b1a8d56b?auto=format&fit=crop&q=80&w=400', true, false),
('Separador de Libros Galaxia', 'Papelería', 18000, 'https://images.unsplash.com/photo-1627384114006-259163ef27c6?auto=format&fit=crop&q=80&w=400', true, false),
('Aretes Gota de Mar', 'Accesorios', 30000, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400', true, false),
('Bandeja Decorativa Mármol', 'Hogar', 85000, 'https://images.unsplash.com/photo-1610708687313-2be2b1a8d56b?auto=format&fit=crop&q=80&w=400', true, false),
('Llavero Minimalista', 'Llaveros', 20000, 'https://images.unsplash.com/photo-1627384113972-f4c03d27935b?auto=format&fit=crop&q=80&w=400', true, false),
('Anillo Encantado', 'Accesorios', 28000, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400', true, false),
('Kit Portavasos Zen', 'Hogar', 60000, 'https://images.unsplash.com/photo-1610708687313-2be2b1a8d56b?auto=format&fit=crop&q=80&w=400', false, false);
