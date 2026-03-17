"use client";

import { useState, useEffect, useMemo } from "react";
import { ProgressRing } from "./ProgressRing";
import { TodoItem } from "./TodoItem";

export type Priority = "high" | "medium" | "low";
export type Category = "work" | "personal" | "other";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  deadline: string;
}

const categoryOptions: { value: Category; label: string }[] = [
  { value: "work", label: "仕事" },
  { value: "personal", label: "プライベート" },
  { value: "other", label: "その他" },
];

const priorityOptions: { value: Priority; label: string }[] = [
  { value: "high", label: "高" },
  { value: "medium", label: "中" },
  { value: "low", label: "低" },
];

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<Category>("work");
  const [deadline, setDeadline] = useState("");
  const [mounted, setMounted] = useState(false);

  const [filterCategory, setFilterCategory] = useState<Category | "all">("all");
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");

  useEffect(() => {
    const saved = localStorage.getItem("todos-v2");
    if (saved) {
      setTodos(JSON.parse(saved));
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("todos-v2", JSON.stringify(todos));
    }
  }, [todos, mounted]);

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      {
        id: crypto.randomUUID(),
        text: trimmed,
        completed: false,
        priority,
        category,
        deadline,
      },
      ...prev,
    ]);
    setInput("");
    setDeadline("");
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (filterCategory !== "all" && todo.category !== filterCategory) return false;
      if (filterPriority !== "all" && todo.priority !== filterPriority) return false;
      return true;
    });
  }, [todos, filterCategory, filterPriority]);

  const completedCount = todos.filter((t) => t.completed).length;

  const selectClass =
    "px-3 py-2.5 rounded-lg border border-border bg-surface text-xs outline-none focus:ring-2 focus:ring-accent/50 transition appearance-none cursor-pointer";

  return (
    <div className="w-full max-w-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-accent">To</span>Do
          </h1>
          <p className="text-xs text-muted mt-1">タスクを管理しよう</p>
        </div>
        {mounted && todos.length > 0 && (
          <ProgressRing completed={completedCount} total={todos.length} />
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTodo();
        }}
        className="mb-6 p-4 rounded-2xl border border-border bg-surface"
      >
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="新しいタスクを入力..."
            className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-accent/50 transition placeholder:text-muted/60"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-dark transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            追加
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className={selectClass}
          >
            {priorityOptions.map((o) => (
              <option key={o.value} value={o.value}>
                優先度: {o.label}
              </option>
            ))}
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className={selectClass}
          >
            {categoryOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className={`${selectClass} min-w-0`}
          />
        </div>
      </form>

      {/* Filters */}
      {mounted && todos.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted font-medium uppercase tracking-wider">
              カテゴリ
            </span>
            <select
              value={filterCategory}
              onChange={(e) =>
                setFilterCategory(e.target.value as Category | "all")
              }
              className="text-xs px-2 py-1 rounded-md border border-border bg-surface outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer"
            >
              <option value="all">すべて</option>
              {categoryOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted font-medium uppercase tracking-wider">
              優先度
            </span>
            <select
              value={filterPriority}
              onChange={(e) =>
                setFilterPriority(e.target.value as Priority | "all")
              }
              className="text-xs px-2 py-1 rounded-md border border-border bg-surface outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer"
            >
              <option value="all">すべて</option>
              {priorityOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          {(filterCategory !== "all" || filterPriority !== "all") && (
            <button
              onClick={() => {
                setFilterCategory("all");
                setFilterPriority("all");
              }}
              className="text-[10px] text-accent hover:text-accent-dark transition ml-auto"
            >
              フィルタ解除
            </button>
          )}
        </div>
      )}

      {/* List */}
      {mounted && (
        <ul className="space-y-2">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))}
        </ul>
      )}

      {/* Empty states */}
      {mounted && todos.length > 0 && filteredTodos.length === 0 && (
        <p className="text-sm text-muted text-center mt-12">
          該当するタスクがありません
        </p>
      )}

      {mounted && todos.length === 0 && (
        <div className="text-center mt-16">
          <div className="text-4xl mb-3 opacity-30">🌿</div>
          <p className="text-sm text-muted">タスクがありません</p>
          <p className="text-xs text-muted/60 mt-1">
            上のフォームからタスクを追加しましょう
          </p>
        </div>
      )}
    </div>
  );
}
