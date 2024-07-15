function Avatar({ width, height, alignSelf, margin }) {
  return (
    <div className='avatar' style={{ width, height, alignSelf, margin }}>
      <img className='avatar-image' src='/bot.png' alt='avatar' />
    </div>
  )
}

export default Avatar
