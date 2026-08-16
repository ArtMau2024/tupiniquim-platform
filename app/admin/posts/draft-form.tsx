"use client";

import Link from "next/link";
import { useActionState } from "react";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";
import type { DraftActionState } from "./draft-actions";
import type { DraftInput } from "@/lib/cms/draft";

type Action = (
  state: DraftActionState,
  data: FormData,
) => Promise<DraftActionState>;

type DraftFormProps = {
  action: Action;
  initial?: Partial<DraftInput>;
};

export function DraftForm({ action, initial }: DraftFormProps) {
  const [state, formAction, pending] = useActionState(action, {});

  const field = (
    name: keyof DraftInput,
    label: string,
    options?: { type?: string; className?: string; hint?: string },
  ) => (
    <label className={`cms-admin-form-field ${options?.className ?? ""}`.trim()}>
      <span className="cms-admin-form-label">{label}</span>
      {options?.hint ? <span className="cms-admin-form-hint">{options.hint}</span> : null}
      <input
        className="cms-admin-form-control"
        name={name}
        type={options?.type ?? "text"}
        defaultValue={(initial?.[name] as string) ?? ""}
        aria-invalid={Boolean(state.errors?.[name])}
        aria-describedby={state.errors?.[name] ? `${name}-error` : undefined}
      />
      {state.errors?.[name] ? (
        <span className="cms-admin-form-error" id={`${name}-error`} role="alert">
          {state.errors[name]}
        </span>
      ) : null}
    </label>
  );

  return (
    <form action={formAction} className="cms-admin-form-card">
      {state.formError ? (
        <p className="cms-admin-alert" role="alert">{state.formError}</p>
      ) : null}

      <div className="cms-admin-form-grid">
        {field("title", "Titulo", {
          className: "cms-admin-form-field-full",
          hint: "Nome principal exibido no artigo.",
        })}

        {field("slug", "Slug", {
          hint: "Use letras minusculas, numeros e hifens.",
        })}

        <label className="cms-admin-form-field">
          <span className="cms-admin-form-label">Categoria</span>
          <span className="cms-admin-form-hint">Organiza o artigo no Blog.</span>
          <select
            className="cms-admin-form-control"
            name="category"
            defaultValue={initial?.category ?? ""}
            aria-invalid={Boolean(state.errors?.category)}
            aria-describedby={state.errors?.category ? "category-error" : undefined}
          >
            <option value="">Selecione</option>
            {BLOG_CATEGORIES.map((category) => (
              <option key={category.slug} value={category.slug}>{category.label}</option>
            ))}
          </select>
          {state.errors?.category ? (
            <span className="cms-admin-form-error" id="category-error" role="alert">
              {state.errors.category}
            </span>
          ) : null}
        </label>

        {field("author", "Autor", {
          hint: "Opcional. O padrao editorial continua preservado.",
        })}
        {field("image", "Imagem", {
          hint: "Caminho publico da imagem do artigo.",
        })}

        {field("description", "Descricao", {
          className: "cms-admin-form-field-full",
          hint: "Resumo curto usado na listagem e nos metadados.",
        })}

        <label className="cms-admin-form-field cms-admin-form-field-full">
          <span className="cms-admin-form-label">Conteudo</span>
          <span className="cms-admin-form-hint">Escreva o corpo completo do artigo.</span>
          <textarea
            className="cms-admin-form-control cms-admin-form-textarea"
            name="content"
            rows={14}
            defaultValue={initial?.content ?? ""}
            aria-invalid={Boolean(state.errors?.content)}
            aria-describedby={state.errors?.content ? "content-error" : undefined}
          />
          {state.errors?.content ? (
            <span className="cms-admin-form-error" id="content-error" role="alert">
              {state.errors.content}
            </span>
          ) : null}
        </label>
      </div>

      <footer className="cms-admin-form-actions">
        <Link className="cms-admin-button cms-admin-button-secondary" href="/admin/posts">
          Voltar
        </Link>
        <button
          className="cms-admin-button cms-admin-button-primary"
          type="submit"
          disabled={pending}
        >
          {pending ? "Salvando..." : "Salvar rascunho"}
        </button>
      </footer>
    </form>
  );
}
