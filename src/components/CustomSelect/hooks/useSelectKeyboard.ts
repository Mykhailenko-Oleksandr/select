import { useEffect, type Dispatch, type RefObject, type SetStateAction } from 'react';
import type { SelectOption } from '../CustomSelect.types';

interface UseSelectKeyboardProps {
  containerRef: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  activeIndex: number;
  options: SelectOption[];
  onSelect: (option: SelectOption) => void;
  resetSearch: () => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setHighlightedIndex: Dispatch<SetStateAction<number>>;
}

export function useSelectKeyboard({
  containerRef,
  isOpen,
  activeIndex,
  options,
  onSelect,
  resetSearch,
  setIsOpen,
  setHighlightedIndex,
}: UseSelectKeyboardProps) {
  useEffect(() => {
    const container = containerRef.current;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!container?.contains(event.target as Node)) return;
      if ((event.target as HTMLElement).closest('button')) return;
      if ((event.target as HTMLElement).tagName === 'INPUT' && event.key.length === 1) return;

      switch (event.code) {
        case 'Enter':
        case 'Space':
          event.preventDefault();

          if (!isOpen) {
            setIsOpen(true);
          } else {
            const option = options[Math.min(activeIndex, options.length - 1)];
            if (option) onSelect(option);
          }
          break;

        case 'ArrowUp':
        case 'ArrowDown': {
          event.preventDefault();

          if (!isOpen) {
            setIsOpen(true);
            break;
          }

          if (!options.length) break;

          const direction = event.code === 'ArrowDown' ? 1 : -1;
          setHighlightedIndex(
            (activeIndex + direction + options.length) % options.length
          );
          break;
        }

        case 'Home':
          if (isOpen && options.length) {
            event.preventDefault();
            setHighlightedIndex(0);
          }
          break;

        case 'End':
          if (isOpen && options.length) {
            event.preventDefault();
            setHighlightedIndex(options.length - 1);
          }
          break;

        case 'Escape':
          if (isOpen) {
            event.preventDefault();
            resetSearch();
            setIsOpen(false);
          }
          break;
      }
    };

    container?.addEventListener('keydown', handleKeyDown);
    
    return () => container?.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, activeIndex, isOpen, options, onSelect, resetSearch, setIsOpen, setHighlightedIndex]);
}