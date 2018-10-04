import { Component } from 'inferno';
import 'bulma/css/bulma.css';

const Card = (props) => {
  return (
    <article class="media box">
      <figure class="media-left">
        <p class="image is-64x64">
          <img src="https://bulma.io/images/placeholders/64x64.png" alt="avatar"/>
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <p>
            <span dangerouslySetInnerHTML={{__html: props.app._highlightResult.name.value}}/>
            <br/>
            <small><a href={props.app.link}>View</a></small>
          </p>
        </div>
      </div>
      <div class="media-right">
        <span class="tag is-light is-rounded" dangerouslySetInnerHTML={{__html: props.app.category}}/>
      </div>
    </article>
  );
}

export default Card;
