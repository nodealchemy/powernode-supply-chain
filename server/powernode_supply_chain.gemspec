# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "powernode_supply_chain"
  # Bundler requires a literal. scripts/release.sh is the ONLY writer of this value
  # (stamped from the release tag); never edit it by hand.
  spec.version       = "0.1.0"
  spec.authors       = ["Everett C. Haimes III"]
  spec.summary       = "Supply Chain Security extension for Powernode"
  spec.description   = "SBOM management, vulnerability scanning, container security, attestations, vendor risk, and license compliance."
  spec.license       = "Proprietary"

  spec.files         = Dir["{app,config,db,lib}/**/*"]
  spec.require_paths = ["lib"]

  spec.add_dependency "rails", ">= 8.0"
end
