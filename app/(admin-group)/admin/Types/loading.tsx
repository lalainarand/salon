export default function Loading() {
  return (
    <div className="flex justify-center items-center h-full">
      <div 
        className="w-8 h-8 border-3 border-gray-200 border-t-3 rounded-full animate-spin"
        style={{ 
          borderTopColor: 'rgb(152,181,127)',
          borderWidth: '3px'
        }}
      ></div>
    </div>
  )
}