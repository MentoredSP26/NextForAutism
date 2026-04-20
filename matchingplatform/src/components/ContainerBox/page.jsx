import styles from './styles.css'

function ContainerBox({header, body, width, height}) {

    return (
        <div className='wholeentirefullboxmegabooleanintfloatstrdoublelongsubwaychickenbaconranchmeltwithextraolives' style={{width:width, height:height}}>
            <div className='bluebackground'>
                <span>{header}</span>
            </div>
            <div className='whitebackground'>
                {body}
            </div>
        </div>
    )
}

export default ContainerBox

