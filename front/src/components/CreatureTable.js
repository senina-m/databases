// Данные такого вида
// const data = [
//     { id: 2131, name: "Anom", birthday: "01.12.2003", birthday: "null", race:"human"  sex: "Male" },
//      ...
//   ]

const CreatureTable = ({data}) => {
  
    return (
        <div className="App">
          <table>
            <tr>
              <th>Имя</th>
              <th>Дата рождения</th>
              <th>Дата смерти</th>
              <th>Раса</th>
              <th>Пол</th>
            </tr>
            {data.map((val, key) => {
              return (
                <tr key={key}>
                  <td>{val.name}</td>
                  <td>{val.birthday}</td>
                  <td>{val.death_date}</td>
                  <td>{val.race}</td>
                  <td>{val.sex}</td>
                </tr>
              )
            })}
          </table>
        </div>
      );
};

export default CreatureTable