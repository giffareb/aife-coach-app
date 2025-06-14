
import React from 'react';

interface MessageBoxProps {
  message: string;
}

export const MessageBox: React.FC<MessageBoxProps> = ({ message }) => {
  // Replace newline characters with <br /> tags for HTML rendering
  const formattedMessage = message.split('\n').map((line, index, array) => (
    <React.Fragment key={index}>
      {line}
      {index < array.length - 1 && <br />}
    </React.Fragment>
  ));

  return (
    <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-4 md:p-6 rounded-lg shadow-inner min-h-[100px] text-gray-700 leading-relaxed text-left pretty-scroll">
      <p className="whitespace-pre-wrap">{formattedMessage}</p>
    </div>
  );
};

// Add some basic scrollbar styling if needed, though Tailwind doesn't directly support pseudo-elements for scrollbars.
// A global style in index.html or a custom Tailwind plugin would be needed for extensive scrollbar styling.
// For now, browser default is fine.
// The 'pretty-scroll' class is a placeholder if one wanted to add custom scrollbar styles via CSS.
// Example of how one *might* add global styles for scrollbars (not done here to stick to Tailwind only in components):
/*
<style>
  .pretty-scroll::-webkit-scrollbar {
    width: 8px;
  }
  .pretty-scroll::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  .pretty-scroll::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
  .pretty-scroll::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
</style>
*/
