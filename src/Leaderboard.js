import './Board.css';

export function Leaderboard(props) {
    var allData = [];
    for (var i = 0; i < props.users.length; i++) {
        if (props.users[i] == props.curr_name) {
            allData.push({
                users:props.users[i]+" (YOU)",
                scores:props.scores[i]
            });
        }
        else {
            allData.push({
                users:props.users[i],
                scores:props.scores[i]
            });
        }
    }
    console.log(allData);
    return (<table id="leaderboard_table">
                <tbody>
                <tr>
                    <th>User</th>
                    <th>Score</th>
                </tr>
                {allData.map((item, index) => (<tr>
                                    {Object.values(item).map((val, index) => (
                                        <td>{val}</td>
                                    ))}
                                </tr>))}
                </tbody>
            </table>                    
            );
}