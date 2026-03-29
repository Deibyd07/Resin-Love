"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function toBoolean(value: FormDataEntryValue | null) {
  return value === "on" || value === "true";
}

function revalidateAll() {
  revalidatePath("/catalogo");
  revalidatePath("/admin");
  revalidatePath("/");
}

// ── Create ───────────────────────────────────────────────────
export async function createProductAction(formData: FormData) {
  await requireAdmin();

  const nombre = String(formData.get("nombre") ?? "").trim();
  const categoria = String(formData.get("categoria") ?? "").trim();
  const precio = Number(formData.get("precio"));
  const imagenUrl = String(formData.get("imagen_url") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const disponible = toBoolean(formData.get("disponible"));
  const destacado = toBoolean(formData.get("destacado"));

  if (!nombre || !categoria || !imagenUrl || Number.isNaN(precio) || precio <= 0) {
    throw new Error("Datos inválidos para crear producto");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("productos").insert({
    nombre,
    categoria,
    precio,
    imagen_url: imagenUrl,
    descripcion: descripcion || null,
    disponible,
    destacado,
  });

  if (error) {
    throw new Error(`No se pudo crear el producto: ${error.message}`);
  }

  revalidateAll();
}

// ── Update ───────────────────────────────────────────────────
export async function updateProductAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const categoria = String(formData.get("categoria") ?? "").trim();
  const precio = Number(formData.get("precio"));
  const imagenUrl = String(formData.get("imagen_url") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const disponible = toBoolean(formData.get("disponible"));
  const destacado = toBoolean(formData.get("destacado"));

  if (!id || !nombre || !categoria || !imagenUrl || Number.isNaN(precio) || precio <= 0) {
    throw new Error("Datos inválidos para actualizar producto");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("productos")
    .update({
      nombre,
      categoria,
      precio,
      imagen_url: imagenUrl,
      descripcion: descripcion || null,
      disponible,
      destacado,
    })
    .eq("id", id);

  if (error) {
    throw new Error(`No se pudo actualizar el producto: ${error.message}`);
  }

  revalidateAll();
}

// ── Toggle Field ─────────────────────────────────────────────
export async function toggleProductFieldAction(id: string, field: "disponible" | "destacado", value: boolean) {
  await requireAdmin();

  if (!id) {
    throw new Error("ID de producto inválido");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("productos")
    .update({ [field]: value })
    .eq("id", id);

  if (error) {
    throw new Error(`No se pudo actualizar el campo: ${error.message}`);
  }

  revalidateAll();
}

// ── Delete ───────────────────────────────────────────────────
export async function deleteProductAction(id: string) {
  await requireAdmin();

  if (!id) {
    throw new Error("ID de producto inválido");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("productos").delete().eq("id", id);

  if (error) {
    throw new Error(`No se pudo eliminar el producto: ${error.message}`);
  }

  revalidateAll();
}

// ── Sign Out ─────────────────────────────────────────────────
export async function signOutAdminAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
