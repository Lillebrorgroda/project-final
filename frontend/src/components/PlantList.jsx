


import "../components/PlantList.css"

const PlantList = () => {
  return (

    <div className="plant-list">
      <div className="plant-item">
        <img src="/Frog.jpg" alt="Nature" />
        <div>
          <div className="plant-item-header">
            <h3>Växtnamn</h3>
          </div>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus perspiciatis, tenetur enim aliquam voluptate veniam doloribus obcaecati deleniti fugiat delectus exercitationem minus aspernatur vero illo nostrum rem magni! Recusandae, sed.</p>
        </div>
      </div>
      {/*<Link to={`/plants/:id`}> <Link to="/account"><button>Mina växter</button></Link>*/}
      <div className="plant-item">
        <img src="/Frog.jpg" alt="Nature" />
        <div>
          <div className="plant-item-header">
            <h3>Växtnamn</h3>
          </div>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus perspiciatis, tenetur enim aliquam voluptate veniam doloribus obcaecati deleniti fugiat delectus exercitationem minus aspernatur vero illo nostrum rem magni! Recusandae, sed.</p>
        </div>
      </div>
      {/*</Link>*/}
      <div className="plant-item">
        <img src="/Frog.jpg" alt="Nature" />
        <div>
          <div className="plant-item-header">
            <h3>Växtnamn</h3>

          </div>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus perspiciatis, tenetur enim aliquam voluptate veniam doloribus obcaecati deleniti fugiat delectus exercitationem minus aspernatur vero illo nostrum rem magni! Recusandae, sed.</p>
        </div>
      </div>
    </div>

  )
}

export default PlantList;