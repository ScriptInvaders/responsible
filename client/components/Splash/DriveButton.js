/* This function will dispatch an action to change to Driver mode */
function nullFn(e) { console.log('you clicked me ' + e.target.className); };

export function DriveButton({
  onDriveButtonClick = nullFn,
}) {
  return (
    <div className='DriveDiv' onClick={onDriveButtonClick}>
			<section className="hero is-medium is-success is-bold">
				<div className ='hero-content'>
					<h1 className='title'>
					Drive
					</h1>
				</div>
      </section>
    </div>
  );
}
