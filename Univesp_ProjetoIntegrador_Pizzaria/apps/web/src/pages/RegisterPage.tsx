import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function RegisterPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [stateUf, setStateUf] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  const cepDigits = useMemo(() => cep.replace(/\D/g, ""), [cep]);

  async function lookupCep(nextCepDigits: string) {
    if (nextCepDigits.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(
        `https://viacep.com.br/ws/${nextCepDigits}/json/`,
      );
      if (!res.ok) throw new Error("Falha ao buscar CEP");
      const data = (await res.json()) as {
        erro?: boolean;
        logradouro?: string;
        bairro?: string;
        localidade?: string;
        uf?: string;
      };
      if (data.erro) throw new Error("CEP não encontrado");
      setStreet(data.logradouro ?? "");
      setNeighborhood(data.bairro ?? "");
      setCity(data.localidade ?? "");
      setStateUf((data.uf ?? "").toUpperCase());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Falha ao buscar CEP");
    } finally {
      setCepLoading(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await auth.register({
        name,
        email,
        password,
        cep: cepDigits,
        street,
        number,
        complement: complement.trim() ? complement.trim() : undefined,
        neighborhood,
        city,
        state: stateUf,
      });
      navigate("/", { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Falha ao cadastrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container auth">
      <div className="auth__card">
        <h2 className="auth__title">Criar conta</h2>
        <p className="muted">
          Cadastre-se para fidelização e histórico de pedidos.
        </p>

        {error ? <div className="alert">{error}</div> : null}

        <form className="form" onSubmit={onSubmit}>
          <label className="field">
            <span className="field__label">Nome</span>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              disabled={loading}
            />
          </label>

          <label className="field">
            <span className="field__label">E-mail</span>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              disabled={loading}
            />
          </label>

          <label className="field">
            <span className="field__label">Senha</span>
            <input
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              minLength={6}
              disabled={loading}
            />
          </label>

          <label className="field">
            <span className="field__label">CEP</span>
            <input
              className="input"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              onBlur={() => lookupCep(cepDigits)}
              inputMode="numeric"
              placeholder="00000-000"
              required
              disabled={loading}
              maxLength={9}
            />
            <span className="muted">
              {cepLoading
                ? "Buscando endereço..."
                : "Digite o CEP para preencher rua/cidade automaticamente."}
            </span>
          </label>

          <label className="field">
            <span className="field__label">Rua</span>
            <input
              className="input"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
              minLength={2}
              disabled={loading || cepLoading}
            />
          </label>

          <label className="field">
            <span className="field__label">Número</span>
            <input
              className="input"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
              disabled={loading}
              maxLength={20}
              placeholder="Ex.: 123"
            />
          </label>

          <label className="field">
            <span className="field__label">Complemento (opcional)</span>
            <input
              className="input"
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
              disabled={loading}
              maxLength={60}
              placeholder="Ex.: ap 34, bloco B"
            />
          </label>

          <label className="field">
            <span className="field__label">Bairro</span>
            <input
              className="input"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              required
              minLength={2}
              disabled={loading || cepLoading}
            />
          </label>

          <label className="field">
            <span className="field__label">Cidade</span>
            <input
              className="input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              minLength={2}
              disabled={loading || cepLoading}
            />
          </label>

          <label className="field">
            <span className="field__label">UF</span>
            <input
              className="input"
              value={stateUf}
              onChange={(e) => setStateUf(e.target.value.toUpperCase())}
              required
              minLength={2}
              maxLength={2}
              disabled={loading || cepLoading}
              placeholder="SP"
            />
          </label>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Criando..." : "Criar conta"}
          </button>
        </form>

        <div className="auth__bottom">
          <span className="muted">Já tem conta?</span>{" "}
          <Link to="/login">Entrar</Link>
        </div>
      </div>
    </div>
  );
}
