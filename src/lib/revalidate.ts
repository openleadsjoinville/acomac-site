import { revalidatePath } from "next/cache";

// Purga o cache ISR das páginas públicas renderizadas no servidor logo após uma
// edição no admin, para que as mudanças apareçam imediatamente em vez de esperar
// a revalidação por tempo (ver `revalidate` nas páginas e os Cache-Control em
// @/lib/cache para os dados buscados no cliente).

// Home (/) depende só do conteúdo "home" e do "global" (as seções usam conteúdo
// curado da página, não as coleções ao vivo).
export function revalidateHome() {
  revalidatePath("/");
}

// /eventos lê a coleção de eventos + o conteúdo "eventos".
export function revalidateEventos() {
  revalidatePath("/eventos");
}

// Todas as instâncias de /blog/[slug] (posts renderizados no servidor).
export function revalidateBlogPosts() {
  revalidatePath("/blog/[slug]", "page");
}

// Conteúdo "global" (cabeçalho, rodapé, contato) aparece em todas as páginas:
// revalida tudo que compartilha o layout raiz de uma vez.
export function revalidateAllPublic() {
  revalidatePath("/", "layout");
}
