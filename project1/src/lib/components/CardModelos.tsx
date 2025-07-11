interface Modelo {
  url_avatar: string;
  url_bkg: string;
  name: string;
  at?: string;
  verified?: boolean;
}

const CardModelos = ({ url_avatar, url_bkg, name, at, verified }: Modelo) => {
  return (
    <div className="card-modelos">
      <img src={url_bkg} alt="Modelo background" className="modelo-bkg" />
      <div className="modelo-effect"></div>
      <div className="modelo-content">
        <div className="modelo-avatar-content">
          <img src={url_avatar} alt="Avatar" className="modelo-avatar" />
        </div>
        <div className="modelo-info-content ">
          <p className="modelo-nome">
            {name}
            {verified && <span className="modelo-verified-icon">✓</span>}
          </p>
          <h3 className="modelo-arroba">{at}</h3>
        </div>
      </div>
    </div>
  );
};

export default CardModelos;
