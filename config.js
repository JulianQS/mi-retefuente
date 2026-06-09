// Mi Retefuente — Configuración tributaria
// Valores de UVT y SMLV son aproximados — verificar con fuentes oficiales (DIAN / Ministerio de Trabajo)
//
// Para agregar un año:  añadir entrada en "anos" apuntando al estatuto vigente
// Para nueva reforma:   crear entrada en "estatutos" con sus tablas y topes

const CONFIG = {

  estatutos: {
    ET_2022: {
      nombre: "Ley 2277 de 2022 — Reforma Tributaria",
      vigencia_desde: 2023,

      tabla_renta: [
        { desde_uvt: 0,     hasta_uvt: 1090,  tarifa: 0.00 },
        { desde_uvt: 1090,  hasta_uvt: 1700,  tarifa: 0.19 },
        { desde_uvt: 1700,  hasta_uvt: 4100,  tarifa: 0.28 },
        { desde_uvt: 4100,  hasta_uvt: 8670,  tarifa: 0.33 },
        { desde_uvt: 8670,  hasta_uvt: 18970, tarifa: 0.35 },
        { desde_uvt: 18970, hasta_uvt: 31000, tarifa: 0.37 },
        { desde_uvt: 31000, hasta_uvt: null,   tarifa: 0.39 }
      ],

      topes: {
        exento_25pct_tope_uvt: 790,
        total_rentas_exentas_uvt: 1340,
        uvt_adicional_por_dependiente: 72,
        max_dependientes: 4,
        limite_rentas_exentas_pct: 0.40,
        factor_exento_25pct: 0.25,
        factor_cesantias: 1.12,
        base_max_cotizacion_smlv: 25,
        aporte_salud_pension_empleado_pct: 0.08,
        tarifa_ganancia_ocasional: 0.15       // Art. 313 ET: tarifa general ganancias ocasionales
      },

      solidaridad: {
        umbral_aplica_smlv: 1,
        umbral_tarifa_alta_smlv: 20,
        tarifa_baja: 0.01,
        tarifa_alta: 0.02,
        tope_maximo_factor_smlv: 0.50
      },

      cesantias_exentas: [
        { hasta_uvt: 350,  pct_exento: 0.90 },
        { hasta_uvt: 410,  pct_exento: 0.80 },
        { hasta_uvt: 470,  pct_exento: 0.60 },
        { hasta_uvt: 530,  pct_exento: 0.40 },
        { hasta_uvt: 590,  pct_exento: 0.20 },
        { hasta_uvt: null,  pct_exento: 0.00 }
      ],

      deduccion_dependientes: {
        pct_ingreso_por_dependiente: 0.10,
        tope_mensual_uvt_por_dependiente: 32
      },

      deduccion_medicina_prepagada: {
        tope_mensual_uvt: 16
      },

      aporte_voluntario_pension_afc: {
        pct_maximo_ingreso: 0.30,  // Art. 126-1 / 126-4 ET: FPV + AFC combinado, 30% ingreso laboral anual
        tope_uvt: 3800             // Art. 126-1 / 126-4 ET: tope absoluto en UVT
      },

      aporte_voluntario_pension_obligatoria: {
        pct_maximo_ingreso: 0.25,  // Art. 55 ET: INCRNGO, 25% ingreso laboral anual
        tope_uvt: 2500             // Art. 55 ET: tope absoluto en UVT
      }
    }
  },

  anos: {
    2023: { uvt: 42412,  smlv: 1160000, estatuto: "ET_2022" },
    2024: { uvt: 47065,  smlv: 1300000, estatuto: "ET_2022" },
    2025: { uvt: 49799,  smlv: 1423500, estatuto: "ET_2022" },
    2026: { uvt: 52374,  smlv: 1750905, estatuto: "ET_2022" }
  }
};
