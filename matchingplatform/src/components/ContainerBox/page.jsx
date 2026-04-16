import styles from './styles.css'

function ContainerBox({header, body}) {

    return (
        <div className='wholeentirefullboxmegabooleanintfloatstrdoublelongsubwaychickenbaconranchmeltwithextraolives'>
            <div className='bluebackground'>
                {header} 
            </div>
            <div className='whitebackground'>
                {body}
            </div>
        </div>
    )
}

export default ContainerBox

