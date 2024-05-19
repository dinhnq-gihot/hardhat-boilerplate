import { expect } from "chai";
import "@openzeppelin/hardhat-upgrades";
import { ethers, upgrades } from "hardhat";
import {
    loadFixture,
} from "@nomicfoundation/hardhat-network-helpers";

describe("TetriX4Token", () => {
    async function deployTokenFixture() {
        const JAN_1ST_2030 = 1893456000;

        const Lock = await ethers.getContractFactory("LockUpgradeable");
        console.log("Deploying Lock...");
        const lock = await upgrades.deployProxy(Lock, [JAN_1ST_2030]);
        await lock.waitForDeployment();

        return { lock }
    }

    it("Now version", async () => {
        const { lock } = await loadFixture(deployTokenFixture);

        const nowVersion = await lock.version();
        expect(nowVersion).to.equal(1);
    });

    it("Upgraded version", async () => {
        const { lock } = await loadFixture(deployTokenFixture);

        const LockNew = await ethers.getContractFactory("LockUpgradeableV2");
        await upgrades.upgradeProxy(process.env.CONTRACT as string, LockNew);
        const upgradedVersion = await lock.version();
        
        expect(upgradedVersion).to.equal(2);
    });
});