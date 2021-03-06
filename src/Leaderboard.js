import './Board.css';

export function Leaderboard(props) {
    var allData = [];
    for (var i = 0; i < props.users.length; i++) {
        if (props.users[i] == props.curr_name) {
            allData.push({
                scores:props.scores[i],
                users:props.users[i]+" (YOU)"
            });
        }
        else {
            allData.push({
                scores:props.scores[i],
                users:props.users[i]
            });
        }
    }
    return (<table class="leaderboard" id="leaderboard_table">
                <tbody>
                <tr>
                    <th>Score</th>
                    <th>User</th>
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