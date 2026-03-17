"use client";

import { useState } from "react";
import type { Todo, Priority, Category } from "./TodoApp";

const priorityConfig: Record<Priority, { label: string; color: string }> = {
  high: { label: "高", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  medium: { label: "中", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  low: { label: "低", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
};

const categoryConfig: Record<Category, { label: string }> = {
  work: { label: "仕事" },
  personal: { label: "プライベート" },
  other: { label: "その他" },
};

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const [removing, setRemoving] = useState(false);
  const [bouncing, setBouncing] = useState(false);

  const handleToggle = () => {
    setBouncing(true);
    onToggle(todo.id);
    setTimeout(() => setBouncing(false), 350);
  };

  const handleDelete = () => {
    setRemoving(true);
    setTimeout(() => onDelete(todo.id), 250);
  };

  const isOverdue =
    !todo.completed &&
    todo.deadline &&
    new Date(todo.deadline) < new Date(new Date().toDateString());

  return (
    <li
      className={`animate-slide-in group flex items-center gap-3 px-4 py-3 rounded-xl border bg-surface hover:bg-surface-hover transition-all ${
        removing ? "animate-fade-out" : ""
      } ${
        todo.completed
          ? "border-border/50 opacity-70"
          : isOverdue
          ? "border-red-300 dark:border-red-800"
          : "border-border hover:border-accent/30"
      }`}
    >
      {/* Check button */}
      <button
        onClick={handleToggle}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          bouncing ? "animate-check-bounce" : ""
        } ${
          todo.completed
            ? "bg-accent border-accent"
            : "border-muted/50 hover:border-accent"
        }`}
        aria-label={todo.completed ? "未完了にする" : "完了にする"}
      >
        {todo.completed && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-sm transition ${
              todo.completed ? "line-through text-muted" : ""
            }`}
          >
            {todo.text}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${priorityConfig[todo.priority].color}`}
          >
            {priorityConfig[todo.priority].label}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent-light/50 text-accent-dark font-medium">
            {categoryConfig[todo.category].label}
          </span>
          {todo.deadline && (
            <span
              className={`text-[10px] ${
                isOverdue ? "text-red-500 font-medium" : "text-muted"
              }`}
            >
              {isOverdue ? "期限切れ: " : ""}
              {new Date(todo.deadline).toLocaleDateString("ja-JP", {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 text-muted hover:text-red-500 transition flex-shrink-0"
        aria-label="削除"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </li>
  );
}
