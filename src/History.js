import debounce from 'lodash.debounce';
import axios from "axios";

export default function History({ data, setData }) {
    const sendHistory = (e) => {
        console.log("Changed value:", e.target.value);
        axios.get(`${process.env.REACT_APP_BACKEND_URL}history?search=${e.target.value}`)
            .then((data) => {
                console.log(data);
                setData(data);
            }).catch((e) => console.error(e));
    };

    return (
        <div>
            <input placeholder="Search" onChange={debounce(sendHistory, 1000)} />
            <table style={{ marginTop: '40px', width: '100%' }}>
                <thead>
                    <tr style={{ textAlign: 'center' }}>
                        <td>URL</td>
                    </tr>
                </thead>
                {
                    data?.length === 0 ? <>Your history is empty</> :
                        data?.map(({ url }, id) => (
                            <tr style={{ background: 'black', color: 'white', height: '40px' }} key={id}>
                                <td>{url}</td>
                            </tr>
                        ))
                }
            </table>
        </div>
    )
}