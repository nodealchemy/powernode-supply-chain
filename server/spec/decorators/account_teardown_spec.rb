# frozen_string_literal: true

require "rails_helper"

# The supply-chain decorator declares ~20 dependents AFTER core's `users`, and
# many of those tables hold FKs to users; Account#run_account_teardown must
# remove them before the account's users.
RSpec.describe "Supply-chain rows and Account teardown" do
  it "removes an SBOM owned by the account together with the account" do
    account = create(:account)
    create(:user, account: account)
    sbom = create(:supply_chain_sbom, account: account)

    expect { account.destroy! }.not_to raise_error

    expect(SupplyChain::Sbom.exists?(sbom.id)).to be false
  end
end
