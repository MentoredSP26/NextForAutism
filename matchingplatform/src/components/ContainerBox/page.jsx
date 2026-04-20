import styles from './styles.css'

function ContainerBox({header, body, width, height}) {

    return (
        <div className='wholeentirefullboxmegabooleanintfloatstrdoublelongsubwaychickenbaconranchmeltwithextraolives' style={{width:width, height:height}}>
            <div className='bluebackground'>
                {header} 
            </div>
            <div className='whitebackground' style={{height:height}}>
                {body}
            </div>
        </div>
    )
}

export default ContainerBox

