"use client";

import { useState, useEffect, useRef } from "react";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      try {
        setTodos(JSON.parse(saved));
      } catch {
        setTodos([]);
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("todos", JSON.stringify(todos));
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
        createdAt: Date.now(),
      },
      ...prev,
    ]);
    setInput("");
    inputRef.current?.focus();
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const remaining = todos.filter((t) => !t.completed).length;
  const total = todos.length;

  if (!mounted) return null;

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-16">
      {/* Header */}
      <div className="w-full max-w-lg mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-stone-800 mb-1">
          やること
        </h1>
        {total > 0 && (
          <p className="text-sm text-stone-400">
            {remaining === 0
              ? "すべて完了！"
              : `残り ${remaining} / ${total} 件`}
          </p>
        )}
      </div>

      {/* Input */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex gap-2 items-center bg-white rounded-2xl shadow-sm border border-stone-200 px-4 py-3 focus-within:ring-2 focus-within:ring-stone-300 transition">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.nativeEvent.isComposing && addTodo()}
            placeholder="新しいタスクを入力..."
            className="flex-1 bg-transparent outline-none text-stone-700 placeholder:text-stone-300 text-base"
          />
          <button
            onClick={addTodo}
            disabled={!input.trim()}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-stone-800 text-white disabled:opacity-30 hover:bg-stone-700 active:scale-95 transition-all"
            aria-label="追加"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 1V13M1 7H13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Todo List */}
      <div className="w-full max-w-lg space-y-2">
        {todos.length === 0 && (
          <div className="text-center py-16 text-stone-300 select-none">
            <p className="text-5xl mb-4">✓</p>
            <p className="text-sm">タスクがありません</p>
          </div>
        )}

        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`group flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 border transition-all shadow-sm ${
              todo.completed
                ? "border-stone-100 opacity-60"
                : "border-stone-200 hover:border-stone-300"
            }`}
          >
            {/* Checkbox */}
            <button
              onClick={() => toggleTodo(todo.id)}
              className={`flex-none w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                todo.completed
                  ? "bg-stone-800 border-stone-800"
                  : "border-stone-300 hover:border-stone-500"
              }`}
              aria-label={todo.completed ? "未完了に戻す" : "完了にする"}
            >
              {todo.completed && (
                <svg
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>

            {/* Text */}
            <span
              className={`flex-1 text-base transition-all ${
                todo.completed
                  ? "line-through text-stone-400"
                  : "text-stone-700"
              }`}
            >
              {todo.text}
            </span>

            {/* Delete */}
            <button
              onClick={() => deleteTodo(todo.id)}
              className="flex-none opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-lg text-stone-300 hover:text-red-400 hover:bg-red-50 transition-all"
              aria-label="削除"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L11 11M11 1L1 11"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Clear completed */}
      {todos.some((t) => t.completed) && (
        <div className="w-full max-w-lg mt-6 flex justify-end">
          <button
            onClick={() => setTodos((prev) => prev.filter((t) => !t.completed))}
            className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
          >
            完了済みを削除
          </button>
        </div>
      )}
    </main>
  );
}
