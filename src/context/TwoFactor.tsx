import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLoading } from "./LoadingContext";

export default function TwoFactor() {
  const [code, setCode] = useState("");
  const { setLoading, loading } = useLoading();
  const [error, setError] = useState("");
  const { qrCode } = useAuth();

  const { verify2FA, logout } = useAuth();
  const navigate = useNavigate();
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (code.length !== 6) {
      setError("O código deve ter 6 dígitos");
      return;
    }

    try {
      setLoading(true);
      await verify2FA(code);

      navigate("/dashboard");
      toast.success('Logado com sucesso!');
    } catch {
      setError("Código inválido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{display: "flex", flexDirection: "column", margin: "20px", justifyContent: "center", alignItems: "center", marginTop: "10%"}}>
      <div style={{border: "1px solid gray", borderRadius: "5px", padding: "16px", boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.04)"}}>
           <div style={{ textAlign: "center", padding: 16, display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
           <h1 style={{marginBottom: "30px", fontSize: "20px", fontWeight: 700}}>Escanei o QR code para a autênticação em dois fatores</h1>
            <img
              src={`data:image/png;base64,${qrCode}`}
              alt="QR Code para autenticação em dois fatores"
              width={180}
              height={180}
            />
        </div>
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "10px",  margin: "40px" }}>
          <h1 style={{fontWeight: 700}}>Autenticação em dois fatores</h1>

          <p style={{fontWeight: 700}}>
            Digite o código gerado no seu aplicativo autenticador
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, ""))
              }
              style={{ fontSize: 20, textAlign: "center", color: "black" }}
            />

            <button style={{marginLeft: "10px", backgroundColor: "#FFFFFF", color: "black", padding: "3px 20px", borderRadius: "5px"}} type="submit" disabled={loading}>
              {loading ? "Validando..." : "Confirmar"}
            </button>
          </form>

          <button
            type="button"
            onClick={logout}
            style={{ marginTop: 16 , border: "1px solid gray", padding: 8, borderRadius: "5px", width: "120px"}}
          >
            Cancelar
          </button>

          {error && (
            <p style={{ color: "red", marginTop: 8 }}>{error}</p>
          )}
        </div>
      </div>
     
      
    </div>
    
  );
}
